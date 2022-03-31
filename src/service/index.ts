// service统一出口
import CVRequest from './request';
import { AXIOS_URL, TIME_OUT, ADMINURL } from './request/config';

// 创建实例的时候传递拦截器,可根据业务需求自行更改
const interceptors = {
  requestInterceptors: (config: any) => {
    const token = localStorage.getItem('improfile');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  requestInterceptorsCatch: (err: any) => {
    return err;
  },
  responseInterceptors: (res: any) => {
    return res.data;
  },
  responseInterceptorsCatch: (err: any) => {
    return err;
  },
};

// 常规接口，如果项目涉及到多个接口地址，可以创建多个，使用命名区分即可
const cvRequest = new CVRequest({
  baseURL: AXIOS_URL,
  timeout: TIME_OUT,
  interceptors,
});

// 后台接口
const adminRequest = new CVRequest({
  baseURL: ADMINURL,
  timeout: TIME_OUT,
  interceptors,
});

export { cvRequest, adminRequest };
