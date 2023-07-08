export const changeStringToJSON = (data: any) => {
  let result = data;
  while (1) {
    if (typeof result === 'string') {
      result = JSON.parse(data);
    } else {
      return result;
    }
  }
};
