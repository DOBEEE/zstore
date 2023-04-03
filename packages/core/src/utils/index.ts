/* eslint-disable no-param-reassign */
export const isPromise = (target: any) => {
  if (typeof target.then === 'function') {
    return true;
  }
  return false;
};
export const isAsync = (target: any) => {
  if (Object.prototype.toString.call(target) === '[object AsyncFunction]') {
    return true;
  }
  return false;
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

export const get = (object: any, path: string | string[], def?: any) => {
  const _path = Array.isArray(path) ? path : path.split('.');
  return (
    _path.reduce((obj, p) => {
      return obj && obj[p];
    }, object) ?? undefined
  );
};
export const set = (object: any, path: string | string[], val: any) => {
  const _path = Array.isArray(path) ? path : path.split('.');
  _path.slice(0, -1).reduce((obj, p) => {
    // eslint-disable-next-line no-param-reassign
    if (!obj[p] && typeof Number(p) === 'number') {
      // eslint-disable-next-line no-param-reassign
      obj[p] = [];
    } else {
      // eslint-disable-next-line no-param-reassign
      obj[p] = obj[p] || {};
    }
    return obj[p];
  }, object)[_path.pop()] = val;
  return object;
};

export const deepCopy = (target: any) => {
  if (typeof target === 'undefined' || target === null) {
    return target;
  }
  return JSON.parse(JSON.stringify(target));
};
export const compose = (...funcs: any) => {
  if (funcs.length === 1) {
    return funcs[0]
  }
  if (funcs.length === 0) {
    throw Error('compose 必须接收至少一个函数');
  }
  return funcs.reduce((a: any, b: any) => (...args: any) => a(b(...args)))
}