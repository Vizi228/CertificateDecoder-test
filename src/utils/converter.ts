const variables = ['2.5.4.3|commonName|X.520 DN component\n', 'UTCTime']

export const convertFromASN = (asn: any) => {
  let res: any[] = [];
  asn.sub[0].sub.filter((item: any) => item.sub && item.sub.length > 1 && item.typeName() === 'SEQUENCE').forEach((a: any, id: number) => {
    if(id < 3) res.push(a);
  })
  for(let i = 0; i < res.length; i++) {
    res[i] = res[i].sub;
  }
  res = res.flat();
  for(let i = 0; i < res.length; i++) {
    if(res[i].sub) {
      res[i] = res[i].sub[0].sub;
    }
  }
  for(let i = 0; i < res.length; i++) {
    if(Array.isArray(res[i])) {
      res[i] = res[i].map((item: any) => (
        item.toPrettyString().split(': ')[1]
      ));
    } else {
      res[i] = res[i].toPrettyString().split(': ');
    }
  }
  let finalResult: any[] = [];
  for(let i = 0; i < res.length; i++) {
    if(res[i][0].includes('UTCTime')) {
      finalResult.push(res[i])
    }
    if(variables.includes(res[i][0])){
      finalResult.push(res[i])
    }
  }
  for(let i = 0; i < finalResult.length; i++) {
    const obj = finalResult[i]
    if(obj[0].includes('UTCTime')) {
      if(i === 1) {
        obj[0] = 'validFrom';
      } else {
        obj[0] = 'validTill';
      }
      obj[1] = obj[1].split(' ')[0];
    }
    if(variables.includes(obj[0])){
      if(i === 0) {
        obj[0] = 'issuerCn';
      } else {
        obj[0] = 'commonName';
      }
    }
  }
  return Object.fromEntries(finalResult)
}