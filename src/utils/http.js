import axios from 'axios';
import envConfig from '@/utils/env';
import router from '@/router/index';
import { Dialog, Toast } from 'vant';
import { logout, toNumber } from '@/utils/common';

axios.prototype.axiosPromiseArr = [];
axios.defaults.timeout = 10000;
axios.defaults.baseURL = envConfig.url;

axios.interceptors.request.use(
  config => {
    let token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  res => {
    if (res.data.code !== 0) {
      if (res.data.code === 401) {
        Toast('登录状态已失效, 请重新登录');
        logout();
        return Promise.reject();
      }
      if (res.data.code === 402) {
        Dialog.alert({
          message: '此账号已在别处登录，如不是本人操作，请尽快修改密码',
        }).then(() => {
          logout();
        });
        return Promise.reject();
      }
    }
    return res.data;
  },
  error => {
    if (error.request.readyState === 4) {
      if (error.request.status === 0) {
        Toast('网络错误');
      }
      if (error.request.status === 500) {
        Toast('请求中断, 请稍后再试');
      }
    }
    return Promise.reject(error);
  },
);
