import axios from 'axios';
import { notification, message } from 'antd';
import { push } from 'react-router-redux';
import { store } from '@/store';
import { baseURL } from '@/config';
import APIError from './APIError';

const methods = ['get', 'post', 'delete', 'put'];

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

class Request {
  constructor() {
    methods.forEach((method) => {
      this[method] = (url, options = {}) =>
        axios({
          method,
          baseURL,
          url,
          ...options,
        }).then(this.checkStatus)
          .then(this.parseResponse)
          .catch(this.dealError);
    });
  }

  checkStatus = (response) => {
    console.log(`checkStatus: ${response}`);
    const { status } = response;
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const { statusText, config: { url } } = response;
    const errorText = codeMessage[status] || statusText;
    notification.destroy();
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });

    const error = new APIError(errorText, status, response, 'failure');
    throw error;
  }

  parseResponse = (response) => {
    console.log(`parseResponse: ${response}`);
    const { data, status } = response;
    if (data.errno * 1 === 0) {
      return { data };
    }
    // 后端接口错误
    const { errmsg: errorText } = data;
    message.destroy();
    message.error(errorText);

    const error = new APIError(errorText, status, response, 'success');
    throw error;
  }

  dealError = (error) => {
    if (error instanceof APIError) {
      console.log(`dealError APIError: ${error}`);
      if (error.result === 'failure') {
        const { dispatch } = store;
        const { status } = error;
        if (status === 401) {
          dispatch({ type: 'auth/LOG_OUT' });
        }
        if (status === 403) {
          dispatch(push('/403'));
        }
      }
      return { error };
    }
    console.log(`dealError defaultError: ${error}`);
    const { response } = error;
    const { status, statusText, config: { url } } = response;
    const errorText = codeMessage[status] || statusText;
    notification.destroy();
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
    return {
      error: new APIError(errorText, status, response, 'failure'),
    };
  }
}

const instance = new Request();

export default instance;
