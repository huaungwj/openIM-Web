// md5 加密秘钥
export const MD5_KEY = 'weiChat';
// OpenIM秘钥，服务端配置文件config.yaml的secret字段，注意安全保存
export const SECRET = 'weiChat';

/**
 * 防抖
 * @param fn
 * @param delay
 * @returns
 */
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

//33、函数节流
export const throttle = function (func: Function, wait: number, type: number) {
  //函数节流 [func 函数 wait 延迟执行毫秒数 type 1 表时间戳版，2 表定时器版]
  let previous: number;
  let context;
  let args;
  let timeout;
  if (type === 1) {
    previous = 0;
  }

  return function () {
    context = this;
    args = arguments;
    if (type === 1) {
      let now = Date.now();
      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
};
