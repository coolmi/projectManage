import axios from './axiosConfig';
import ding from '../lib/ding'

const AUTH_DINGTALKCODE = 'auth.dingtalkcode';
export default {
  /**
   * 获取JsApi参数
   * @param cb
   */
  getJsApiInfos: function (params, cb) {
    let dingtalkCode = ding.parseParam(window.location.href, 'dingtalk_code') || ding.getLocation(AUTH_DINGTALKCODE)
    axios.get('/api/ddtalk/miandeng/h5config?purl=' + params + '&dingtalk_code=' + dingtalkCode)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 登录
   * @param params
   * @param cb
   */
  getLogin: function (data, cb) {
    let dingtalkCode = ding.parseParam(window.location.href, 'dingtalk_code') || ding.getLocation(AUTH_DINGTALKCODE)
    axios.get('/dingding/es/login?code=' + data + '&dingtalk_code=' + dingtalkCode)
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  /**
   * 获取登录
   * @param params
   * @param cb
   */
  getUserInfos: function (cb) {
    axios.get('/dingding/pm/info')
      .then((res) => {
        cb(res);
      }).catch((error) => {
      return Promise.reject(error)
    })
  },
  // 保存/提报修改
  saveDaily: function (params, cb) {
    axios.post('/authapi/ddtalkwf/saveDaily', params)
      .then(res => {
        cb(res)
      }).catch(error => {
      return Promise.reject(error)
    })
  },
  // 获取工作类型
  getDailytype: function (cb) {
    axios.get('/authapi/ddtalkwf/getDailytype?skey=dailytype')
      .then(res => {
        cb(res)
      }).catch(error => {
      return Promise.reject(error)
    })
  },
  // 获取默认人员
  getDefaultPerson: function (cb) {
    axios.get('/authapi/ddtalkwf/getDailytype?skey=defaultperson')
      .then(res => {
        cb(res)
      }).catch(error => {
      return Promise.reject(error)
    })
  },
  getAddressInfos: function (cb) {
    axios.get('/authapi/ddtalkwf/getAddress')
      .then(res => {
        cb(res)
      }).catch(error => {
      return Promise.reject(error)
    })
  },
  // 获取已保存历史数据
  getDailyInfosByUseidAndSdateAndEdate: function (sdate, edate, cb) {
    axios.get('/authapi/ddtalkwf/getDailyInfosByUseidAndSdateAndEdate?sdate=' + sdate + '&edate=' + edate + '&userid=')
      .then(res => {
        cb(res)
      }).catch(error => {
      return Promise.reject(error)
    })
  },
  // 报表数据获取
  getReportDailyInfos: function (sdate, edate, username, ltype, address, cb) {
    axios.get('/authapi/ddtalkwf/getReportDailyInfos?sdate=' + sdate + '&edate=' + edate + '&username=' + username + '&ltype=' + ltype + '&address=' + address)
      .then(res => {
        cb(res)
      }).catch(error => {
      return Promise.reject(error)
    })
  },
  // 通过钉钉id获取用户itcode
  getUserInfoDdid: function (params, cb) {
    axios.get('/authapi/newleave/getUserInfoByDdid' + '?ddid=' + params)
      .then(res => {
        cb(res)
      }).catch(error => {
      return Promise.reject(error)
    })
  },
  // 获取view信息
  getHistroyDailyInfos: function (sdate, edate, cb) {
    axios.get('/authapi/ddtalkwf/getHistroyDailyInfos?sdate=' + sdate + '&edate=' + edate + '&userid=')
      .then(res => {
        cb(res)
      }).catch(error => {
      cb(error)
    })
  }
}
