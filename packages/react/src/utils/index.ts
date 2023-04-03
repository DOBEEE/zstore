export const getClassProvider = <T extends Models>(store: TStores<T>) => {
  const { models, dispatchs, getState } = store;
  const res: any = {};
  for (const key in models) {
    if (Object.prototype.hasOwnProperty.call(models, key)) {
      res[key] = {
        state: getState(key),
        ...dispatchs[key],
      };
    }
  }
  return res;
};
export const checkPath = (current: string, target: string) => {
  const curArr = current.split('.');
  const tarArr = target.split('.');
  if (curArr.length !== tarArr.length) {
    const num = Math.abs(curArr.length - tarArr.length);
    for (let index = 0; index < num; index++) {
      if (curArr[index] !== tarArr[index]) {
        return false;
      }
    }
  } else {
    for (let index = 0; index < curArr.length; index++) {
      if (curArr[index] !== tarArr[index]) {
        return false;
      }
    }
  }
  return true;
};