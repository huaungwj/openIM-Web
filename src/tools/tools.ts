import type { RcFile } from 'rc-upload/lib/interface';
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

// 函数节流
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

// 文件后缀匹配
export const fileExtension = (filename: string) => {
  const str = filename.split('.').pop().toLowerCase();
  return str;
};

// 文件大小转换
export const fileSizeTran = (fileSize: number) => {
  // 1 G = 1073741824 B
  // 1 MB = 1048576 B
  // 1 KB = 1024 B

  let result = '';
  if (fileSize >= 1073741824) {
    // B => GB
    result =
      fileSize % 1073741824 === 0
        ? fileSize / 1073741824 + 'G'
        : Math.trunc(fileSize / 1073741824) + 'G';
  } else if (fileSize >= 1048576) {
    // B => MB
    result =
      fileSize % 1048576 === 0
        ? fileSize / 1048576 + 'MB'
        : Math.trunc(fileSize / 1048576) + 'MB';
  } else if (fileSize >= 1024) {
    // B => KB
    result =
      fileSize % 1024 === 0
        ? fileSize / 1024 + 'KB'
        : Math.trunc(fileSize / 1024) + 'KB';
  } else {
    result = fileSize + 'B';
  }

  return result;
};

/**
 * 获取图片信息
 * @param file
 * @returns
 */
export const getPicInfo = (file: RcFile): Promise<HTMLImageElement> => {
  console.log(file);
  return new Promise((resolve, reject) => {
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = _URL.createObjectURL(file);
  });
};

/**
 *  获取视频信息
 * @param file
 * @returns
 */
export const getVideoInfo = (file: RcFile): Promise<number> => {
  return new Promise((resolve, reject) => {
    const Url = URL.createObjectURL(file);
    const vel = new Audio(Url);
    vel.onloadedmetadata = function () {
      resolve(vel.duration);
    };
  });
};
