const BASE_URL = 'http://139.159.224.67';
const TIME_OUT = 8000;
// AXIOSURL
const AXIOS_URL: string = BASE_URL + ':42233';
// IM
const IMURL = 'ws://139.159.224.67:30000';
//    获取cos临时密钥及调用管理员API地址
const ADMINURL = BASE_URL + ':10000';

//生产
// if (process.env.NODE_ENV === 'development') {
//   BASE_URL = '';
// } else if (process.env.NODE_ENV === 'production') {
//   // 上线环境
//   BASE_URL = '';
// } else {
//   // 测试环境
//   BASE_URL = '';
// }

export { BASE_URL, TIME_OUT, AXIOS_URL, IMURL, ADMINURL };
