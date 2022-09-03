import React, { useEffect, useState } from 'react';
import './App.css';
import { ICer } from './types/cerTypes';
import { convertFromASN } from './utils/converter';
const ASN1 = require('@lapo/asn1js');

function App() {
  const [file, setFile] = useState(false);
  const [certificates, setCertificates] = useState<ICer[]>([]);
  const [certificateId, setCertificateId] = useState<string | null>(null);

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFile(true);
  };

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFile(false);
  };

  const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    let files = e.dataTransfer.files;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const result = ASN1.decode(reader.result);
        const converted = convertFromASN(result);
        if (certificates.some((item) => item.commonName === converted.commonName)) {
          alert('Сертифікат з таким ім`ям вже існує');
          return;
        }
        localStorage.setItem('certificates', JSON.stringify([...certificates, converted]));
        setCertificates((prev) => {
          return [...prev, converted] as ICer[];
        });
      } catch (error) {
        alert(`${error}`);
      }
    };
    reader.readAsBinaryString(files[0]);
    setFile(false);
  };

  const onAddHandler = () => {
    setFile(!file);
    setCertificateId(null);
  };
  useEffect(() => {
    const certificates = localStorage.getItem('certificates');
    setCertificates(JSON.parse(certificates || `[]`));
  }, [setCertificates]);
  return (
    <div className="App">
      <div className="fullfill">
        <div className="right-block">
          <div className="right-block__items">
            {certificates?.map((cer, id) => (
              <div
                className={`${
                  certificateId && id === +certificateId ? 'active' : ''
                } right-block__item`}
                onClick={() => setCertificateId(String(id))}>
                {cer.commonName}
              </div>
            ))}
          </div>
          <button className="right-block__button" onClick={onAddHandler}>
            Додати
          </button>
        </div>
        <div className="left-block">
          {file ? (
            <div
              onDragStart={(e) => dragStartHandler(e)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              onDragOver={(e) => dragStartHandler(e)}
              onDrop={(e) => dropHandler(e)}
              className="droparea"
              style={{ opacity: 0.7 }}>
              Перетяніть файл сертифіката сюди
            </div>
          ) : !!certificateId ? (
            <div className="cert-data">
              <p>Common Name: {certificates[+certificateId].commonName}</p>
              <p>Issuer CN: {certificates[+certificateId].issuerCn}</p>
              <p>Valid From: {certificates[+certificateId].validFrom}</p>
              <p>Valid Till: {certificates[+certificateId].validTill}</p>
            </div>
          ) : (
            <div className="droparea" style={{ opacity: 0.7 }}>
              Виберіть сертифікат, щоб переглянути інформацію
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
