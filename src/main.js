import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from '@/api/api'
import ding from '@/lib/ding'
import { Table, TableColumn } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import Datetime from 'vux/src/components/datetime/index.vue'
import DatetimeView from 'vux/src/components/datetime-view/index.vue'
import Popup from 'vux/src/components/popup/index.vue'
import Group from 'vux/src/components/group/index.vue'
import GroupTitle from 'vux/src/components/group-title/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import XTextarea from 'vux/src/components/x-textarea/index.vue'
import XButton from 'vux/src/components/x-button/index.vue'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import Cell from 'vux/src/components/cell/index.vue'
import Tabbar from 'vux/src/components/tabbar/tabbar.vue'
import TabbarItem from 'vux/src/components/tabbar/tabbar-item.vue'
import Flexbox from 'vux/src/components/flexbox/flexbox.vue'
import FlexboxItem from 'vux/src/components/flexbox/flexbox-item.vue'
import Box from 'vux/src/components/box/index.vue'
// import ding from '@/lib/ding'

Vue.config.productionTip = false
Vue.component('datetime-view', DatetimeView)
Vue.component('datetime', Datetime)
Vue.component('x-input', XInput)
Vue.component('cell', Cell)
Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)
Vue.component('x-textarea', XTextarea)
Vue.component('x-button', XButton)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('group', Group)
Vue.component('group-title', GroupTitle)
Vue.component('popup', Popup)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('Box', Box)
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);

//
store.dispatch('saveURL', location.href)
store.dispatch('saveDingTalkCode')

ding.ddLogin(location.href).then(data => {
  initVue()
}).catch((err) => {
  let dd = window.dd
  dd.device.notification.alert({
    message: err.msg.errorMessage,
    title: '提示',
    buttonName: '确定',
    onSuccess: function() {
      // dd.biz.navigation.close()
    },
    onFail: function(err) {}
  });
})

Vue.prototype.dd = window.dd;

function initVue() {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
