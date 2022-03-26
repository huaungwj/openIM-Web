import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface CVRequestInterceptors {
  requestInterceptors: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch: (error: any) => any;
  responseInterceptors: (config: AxiosResponse) => AxiosResponse;
  responseInterceptorsCatch: (error: any) => any;
}

export interface CVRequestConfig extends AxiosRequestConfig {
  // 自定义拦截器
  interceptors?: CVRequestInterceptors;
  // 是否显示Loading
  showLoading?: boolean;
}
