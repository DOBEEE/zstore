/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
export default (
  target: any,
  paramKey: string,
  cb?: (val: any, key: string, unRerenderPage: any, noPost: boolean) => void
) => {
  definePro(target, paramKey, 'root', target[paramKey]);

  function observe(obj: any, parentPath: string) {
    if (!obj || typeof obj != 'object') {
      return;
    }
    // eslint-disable-next-line guard-for-in
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        definePro(obj, key, `${parentPath}.${key}`, obj[key]);
      }
    }
  }
  function definePro(obj: any, key: string, path: string, value: any) {
    observe(value, path);
    Object.defineProperty(obj, key, {
      get() {
        return value;
      },
      set(newval) {
        if (JSON.stringify(newval) == JSON.stringify(value)) {
          value = newval;
          observe(newval, path);
        } else {
          if (newval?.unRerenderPage) {
            const unRerenderPage = newval.unRerenderPage;
            delete newval.unRerenderPage;
            console.log('【store】: 检测到变化，unrerender', path, newval._agro_store_result);
            value = newval._agro_store_result;
            observe(newval._agro_store_result, path);
            cb && cb(newval._agro_store_result, path, unRerenderPage, newval.noPost);
            return;
          }
          if (newval?._agro_store_result) {
            console.log('【store】: 检测到变化', path, newval._agro_store_result);
            value = newval._agro_store_result;
            observe(newval._agro_store_result, path);
            cb && cb(newval._agro_store_result, path, false, newval.noPost);
            return;
          }
          console.log('【store】: 检测到变化', path, newval);
          value = newval;
          newval && observe(newval, path);
          cb && cb(newval, path, false, false);
        }
      },
    });
  }
};
