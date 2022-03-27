// md5 加密秘钥
export const MD5_KEY = 'weiChat';
// OpenIM秘钥，服务端配置文件config.yaml的secret字段，注意安全保存
export const SECRET = 'weiChat';

export const debounce = (fn: Function, delay: number) => {
  let timer: number;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
};
