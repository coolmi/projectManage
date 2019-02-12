<template>
  <div id="app">
    <router-view/>
    <div v-transfer-dom>
      <popup v-model="showPopTop" position="top" :show-mask="false" style="z-index: 10000000">
        <div class="position-vertical">
          <div v-html="showPopMessage"></div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import { TransferDom, Popup } from 'vux'
  import { mapState, mapGetters } from 'vuex'
  import store from '../src/store'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup
    },
    computed: {
      ...mapGetters({
        path: 'getddConfigPath'
      }),
      ...mapState({
        topMessage: state => state.loading.topMessage,
        showTopMessage: state => state.loading.showTopMessage,
        showMore: state => state.loading.showMore,
        isLoading: state => state.loading.isLoading
      })
    },
    watch: {
      showTopMessage: function (val, oldVal) {
        if (val && !oldVal) {
          this.showPopTop = true;
          this.showPopMessage = this.topMessage;
        } else {
          this.showPopTop = false;
        }
      },
      showPopTop(val) {
        if (val) {
          setTimeout(() => {
            store.dispatch('showTopMessage', false);
            this.showPopTop = false
          }, 1800)
        }
      },
      isLoading: function (val, oldVal) {
        if (val && !oldVal) {
          this.showLoad = true;
        } else {
          this.showLoad = false;
        }
      }
    },
    data() {
      return {
        showPopTop: false,
        showLoad: false,
        showPopMessage: ''
      }
    },
    created() {
      let dd = window.dd
      dd.ui.webViewBounce.disable()
//      let rightBtn = {
//        text: '',
//        show: false, // 控制按钮显示， true 显示， false 隐藏， 默认true
//        control: false, // 是否控制点击事件，true 控制，false 不控制， 默认false
//        showIcon: true, // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
//        onSuccess: function (result) {
//        }
//      }
//      dd.biz.navigation.setRight(rightBtn)
    },
    methods: {
    }
  }
</script>

<style lang="less">
  #app {
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    /*height: 100%;*/
    /*width: 100%;*/
  }

  body {
    background-color: #ffffff;
    line-height: 1.6;
    font-size: 16px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding-top: constant(safe-area-inset-top);
    padding-left: constant(safe-area-inset-left);
    padding-right: constant(safe-area-inset-right);
    padding-bottom: constant(safe-area-inset-bottom);
  }

  .position-vertical {
    background-color: #38ADFF;
    color: #fff;
    text-align: center;
    padding: 15px;
  }

  * {
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  a img {
    border: 0;
  }

  a {
    text-decoration: none;
  }

  ol, ul {
    list-style-type: none
  }
</style>
