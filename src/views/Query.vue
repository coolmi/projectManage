<template>
  <div>
    <transition name="fade">
      <div class="selectDate">
        <div class="selectDate-showDate" @click="goQueryContent">
          {{title}}
        </div>
      </div>
    </transition>
    <router-view style="margin-top: 60px; position: fixed; top: 0"></router-view>
    <!--<tabbar style="position: fixed">-->
      <!--<tabbar-item @on-item-click="tbClick">-->
        <!--<img slot="icon" src="../assets/images/rc.png">-->
        <!--<span slot="label">提报</span>-->
      <!--</tabbar-item>-->
      <!--<tabbar-item selected>-->
        <!--<img slot="icon" src="../assets/images/tj_active.png">-->
        <!--<span slot="label">统计</span>-->
      <!--</tabbar-item>-->
    <!--</tabbar>-->

  </div>
</template>

<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import { mapGetters } from 'vuex'
  import api from '../api/api'
  import ding from '../lib/ding'
  export default {
    directives: {
      TransferDom
    },
    computed: {
      ...mapGetters({
        queryInfo: 'getQueryInfo'
      })
    },
    data() {
      return {
        title: '点击选择查询条件'
      }
    },
    created() {
      this.setRight()
//      if (this.queryInfo != null) {
//        let title = this.queryInfo.sdate + '至' + this.queryInfo.edate + '，' + this.queryInfo.address
//        this.title = title
//      }
    },
    methods: {
      setRight() {
        let dd = window.dd
        let _that = this;
        let rightBtn = {
          text: '切换用户',
          show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
          control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
          showIcon: true, // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
          onSuccess: function (result) {
            api.getLogout(function (res) {
              console.log(res)
              dd.device.notification.prompt({
                message: '请输入itcode',
                title: '提示',
                buttonLabels: ['确定', '取消'],
                onSuccess: function (result) {
                  console.log(result)
                  console.log(_that.path)
                  if (result.buttonIndex === 0) {
                    ding.getRequestAuthCode(_that.path).then((data) => {
                      api.getDebugLogin(data, result.value, function (res) {
                        if (res.data.code) {
                          _that.showPage = 1;
                        } else {
                          _that.showPage = 2;
                        }
                      })
                    })
                  }
                },
                onFail: function (err) {
                }
              });
            })
          }
        }
        ding.setRight(rightBtn)
      },
      // setRight() {
      //   let dd = window.dd;
      //   let _that = this;
      //   dd.biz.navigation.setRight({
      //     show: true,
      //     control: false,
      //     text: '',
      //     onSuccess: function(result) {
      //     },
      //     onFail: function(err) {}
      //   })
      // },
      goQueryContent() {
        this.$router.push('/qc')
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../styles/pro/queryContent";
</style>
