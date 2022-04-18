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
export const debounce = (fn: () => void, delay: number) => {
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

/**
 * 中英文排序
 * @param arr
 * @param type nickname | groupName
 * @returns
 */
export const pySegSort = (arr: any[], type: string) => {
  if (arr.length == 0) return;
  if (!String.prototype.localeCompare) return null;
  const letters = '#ABCDEFGHJKLMNOPQRSTWXYZ'.split('');
  const zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('');
  const segs: any = []; // 存放数据
  const res: any = {};
  let curr: any;
  const re = /[^\u4e00-\u9fa5]/; //中文正则
  const pattern = new RegExp(
    "[`\\-~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？12345678990]"
  ); //特殊符号

  letters.filter((items, i) => {
    curr = {
      initial: '', //字母
      data: [], //数据
    };
    arr.map((v, index) => {
      // 特殊字符
      if (pattern.test(v[type][0])) {
        if (
          (!zh[i - 1] || zh[i - 1].localeCompare(v[type]) <= 0) &&
          v[type].localeCompare(zh[i]) == -1
        ) {
          curr.data.push(v);
        }
      }
      // 判断首个字是否是中文
      if (re.test(v[type][0])) {
        // 英文
        if (v[type][0].toUpperCase() == items) {
          curr.data.push(v);
        }
      } else {
        // 中文
        if (
          (!zh[i - 1] || zh[i - 1].localeCompare(v[type]) <= 0) &&
          v[type].localeCompare(zh[i]) == -1
        ) {
          curr.data.push(v);
        }
      }
    });

    if (curr.data.length) {
      curr.initial = letters[i];
      segs.push(curr);
      curr.data.sort((a: any, b: any) => {
        return a[type].localeCompare(b[type]);
      });
    }
  });
  res.segs = Array.from(new Set(segs)); //去重
  // console.log(res.segs);
  const lastData = res.segs.shift();
  res.segs.push(lastData);
  return res;
};

/**
 * 判断元素是否在可视区域内
 * top 大于等于 0
 * left 大于等于 0
 * bottom 小于等于视窗高度
 * right 小于等于视窗宽度
 */
export function isContain(dom: any) {
  const totalHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const totalWidth = window.innerWidth || document.documentElement.clientWidth;
  // 当滚动条滚动时，top, left, bottom, right时刻会发生改变。
  const { top, right, bottom, left } = dom.getBoundingClientRect();
  return top >= 0 && left >= 0;
}
