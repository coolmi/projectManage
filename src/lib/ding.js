/**
 * 关于钉钉的一些配置
 */
import dingApiConfig from '@/lib/dingApiConfig'
import store from '@/store'
import api from '@/api/api'
import FlowError from '@/lib/FlowError'
let _ = require('lodash/fp/object');

const RIGHT_TOP_TITLE = '帮助'; // 页面右上角的名称
const GMK_LZL = '094211534726242584'
const GMK_GJH = '051448223438009854'
const GMK_LZH = '3001136920996174'
const GMK_XCM = '131509693424719696'
const GMK_ZYM = '154262480124247593'
const GMK_LHH = '045643174726213386'
const GMK_YF = '47412324667285'
const GMK_GZC = '052936314036407067'
const W3_CONCAT_DDID = '095117221320233106'
const W3_YUNWEI_DDID = '131164676026354846'
const JH_CONCAT_DDID = 'manager9648' // 京华世家任小冰的ddid

const JH_DINGTALK_CODE = 'APPSERVER-JH' // 京华世家dingtalk_code
const SHYS_DINGTALK_CODE = 'APPSERVER-YS' // 上海聿晟dingtalk_code

const CORPID = 'ding7d5c838d71be2f8535c2f4657eb6378f';
const AUTH_DDCONFIG = 'auth.ddconfig';
const localStorage = global.localStorage;
let dd = window.dd;

export function getLocation(key) {
  return localStorage.getItem(key) || 'APPSERVER';
}

export function getItemInLocation() {
  let ddconfig = localStorage.getItem(AUTH_DDCONFIG);
  return JSON.parse(ddconfig)
}

export function parseParam(url, param) {
  var searchIndex = url.indexOf('?');
  var searchParams = url.slice(searchIndex + 1).split('&');
  for (var i = 0; i < searchParams.length; i++) {
    var items = searchParams[i].split('=');
    if (items[0].trim() === param) {
      return items[1].trim();
    }
  }
}

export function getPhoneInfo() {
  dd.device.base.getPhoneInfo({
    onSuccess: function (data) {
      store.dispatch('savePhoneInfos', data)
    },
    onFail: function (err) {
    }
  });
}

export function ddLogin(path) {
  return new Promise((resolve, reject) => {
    if (path === undefined || path === '') {
      reject(new FlowError('钉钉授权验证失败'))
      return
    }
    getRequestAuthCode(path).then(data => {
      api.getLogin(data, function (res) {
        if (res.data.code) {
          resolve(true)
        } else {
          reject(new FlowError('钉钉免登失败'))
        }
      })
    }).catch((err) => {
      reject(err)
    })
  });
}

export function getRequestAuthCode(path) {
  return new Promise((resolve, reject) => {
    jsApiOAuth(path).then((ddconfig) => {
      dd.ready(function () {
        dd.runtime.permission.requestAuthCode({
          corpId: ddconfig.corpId,
          onSuccess: function (result) {
            store.dispatch('updateCode', result.code)
            resolve(result.code)
          },
          onFail: function (err) {
            store.dispatch('updateCode', false)
            reject(new FlowError('获取免登陆码失败'))
            // window.alert('dd ding error: ' + window.location.href + JSON.stringify(err));
            // whole.showTop(dingEM.ddRequestAuthCodeError)
          }
        })
      })
      dd.error(function (err) {
        reject(new FlowError(err))
      });
    }).catch((err) => {
      reject(new FlowError(err))
    });
  })
}

export function jsApiOAuth(path) {
  return new Promise((resolve, reject) => {
    api.getJsApiInfos(encodeURIComponent(path), function (res) {
      if (res.data.code) {
        let data = res.data.data;
        const checks = ['agentId', 'corpId', 'timeStamp', 'nonceStr', 'signature'];
        const responseKey = Object.keys(data);
        checks.map(function (v) {
          const checkResult = responseKey.filter(function (k) {
            return v === k;
          });
          if (checkResult.length === 0) {
            reject(new FlowError('jsApiOAuth Response ' + v + ' 不能返回空'))
          }
        });
        let jsApiList = getJSApiList()
        let ddConfig = {
          agentId: data.agentId, // 必填，微应用ID
          corpId: data.corpId, // 必填，企业ID
          timeStamp: data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          type: 0, // 选填。0表示微应用的jsapi,1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
          jsApiList: jsApiList // 必填，需要使用的jsapi列表，注意：不要带dd。
        }
        store.dispatch('dcSuccess', ddConfig)
        dd.config(ddConfig)
        resolve(ddConfig)
      } else {
        store.dispatch('dcFail')
        reject(new FlowError('获取ddConfig 接口错误'))
      }
    })
  })
}

export function getJSApiList() {
  let dacArr = _.keys(dingApiConfig);
  let jsApiList = [];
  for (let d of dacArr) {
    if (dingApiConfig[d]) {
      jsApiList.push(d)
    }
  }
  return jsApiList
}

export function setRight(config = {}) {
  dd.ready(function () {
    dd.biz.navigation.setRight(config)
  });
}

export function confirm(config) {
  dd.ready(function () {
    dd.device.notification.confirm(config)
  });
}

export function showPreloader(mes = '加载中', showIcon = true) {
  dd.device.notification.showPreloader({
    text: mes,
    showIcon: showIcon,
    onSuccess: function(result) {
    },
    onFail: function(err) {}
  })
}

export function showToast(mes = '成功', icon = 'success') {
  dd.device.notification.toast({
    icon: icon,
    text: mes,
    duration: 3,
    onSuccess: function(result) {
    },
    onFail: function(err) {}
  })
}

export function hidePreloader() {
  dd.device.notification.hidePreloader()
}

export default {
  CORPID,
  RIGHT_TOP_TITLE,
  GMK_GJH,
  GMK_LZL,
  GMK_XCM,
  GMK_ZYM,
  GMK_LZH,
  GMK_LHH,
  GMK_YF,
  GMK_GZC,
  W3_CONCAT_DDID,
  W3_YUNWEI_DDID,
  JH_CONCAT_DDID,
  JH_DINGTALK_CODE,
  SHYS_DINGTALK_CODE,
  getItemInLocation,
  getPhoneInfo,
  getLocation,
  parseParam,
  ddLogin,
  getRequestAuthCode,
  jsApiOAuth,
  setRight,
  confirm,
  showPreloader,
  hidePreloader,
  showToast,
  getJSApiList
}
