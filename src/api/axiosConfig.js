import axios from 'axios'
import baseConfig from './baseConfig'
import ding from '@/lib/ding'
import whole from '@/lib/whole'

// let dd = window.dd
axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = baseConfig.baseURL;

axios.interceptors.request.use((config) => {
  if (!(config.url.indexOf('h5config') >= 0) && !(config.url.indexOf('authorizedInfo') >= 0)) { // dding config 不显示刷新状态框 为啥？ 为了体验
  }
  return config;
}, (error) => {
  ding.hidePreloader()
  Promise.reject(error)
});

axios.interceptors.response.use((res) => {
  ding.hidePreloader()
  if (res.data.code) {
    if (res.data.code === '200' || res.data.code === 200) {
      res.data.code = true;
    } else if (res.data.code === '401' || res.data.code === 401) {
      // ding.alertInfo(res.data.message);
      res.data.code = false;
      return Promise.resolve(res);
    } else {
      res.data.code = false;
      return Promise.resolve(res);
    }
  } else if (res.data.state) {
    if (res.data.state === '200' || res.data.code === 200) {
      res.data.code = true;
    } else if (res.data.state === '401' || res.data.code === 401) {
      res.data.code = false;
    } else {
      res.data.code = false;
      return Promise.resolve(res);
    }
  } else if (res.data.error) {
    res.data.code = false;
    whole.showTop({ msg: res.data.error })
    return Promise.resolve(res);
  }
  return res;
}, (error) => {
  ding.hidePreloader()
  Promise.reject(error)
})
export default axios;
