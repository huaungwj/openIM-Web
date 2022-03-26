// service统一出口
import CVRequest from './request';
import { AXIOS_URL, TIME_OUT } from './request/config';

// 常规接口，如果项目涉及到多个接口地址，可以创建多个，使用命名区分即可
const cvRequest = new CVRequest({
  baseURL: AXIOS_URL,
  timeout: TIME_OUT,
  // 创建实例的时候传递拦截器,可根据业务需求自行更改
  interceptors: {
    requestInterceptors: (config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.token = token;
      }
      return config;
    },
    requestInterceptorsCatch: (err) => {
      return err;
    },
    responseInterceptors: (res) => {
      return res.data;
    },
    responseInterceptorsCatch: (err) => {
      return err;
    },
  },
});

export default cvRequest;
