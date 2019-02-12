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
  import {mapGetters} from 'vuex'


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
        let dd = window.dd;
        let _that = this;
        dd.biz.navigation.setRight({
          show: false,
          control: false,
          text: '',
          onSuccess: function(result) {
          },
          onFail: function(err) {}
        })
      },
      goQueryContent() {
        this.$router.push('/qc')
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../styles/pro/queryContent";
</style>
