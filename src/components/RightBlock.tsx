import React, { FC, SetStateAction } from 'react';

interface IRightBlock {
  certificateId: string | null;
  id: number;
  name: string;
  setCertificateId: React.Dispatch<SetStateAction<string | null>>;
}

const RightBlock: FC<IRightBlock> = ({ certificateId, id, setCertificateId, name }) => {
  return (
    <div
      className={`${certificateId && id === +certificateId ? 'active' : ''} right-block__item`}
      onClick={() => setCertificateId(String(id))}>
      {name}
    </div>
  );
};
export default RightBlock;
