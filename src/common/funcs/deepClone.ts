const deepClone = (object: object) => {
  return JSON.parse(JSON.stringify(object));
};

export default deepClone