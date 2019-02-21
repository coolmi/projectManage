<template>
  <div>
    <div style="height:44px;">
      <sticky :check-sticky-support="false">
        <!--<tab :line-width=2 v-model="index">-->
          <!--<tab-item class="vux-center" :selected="selectedIndex === index" v-for="(item, index) in dbTab"-->
                    <!--@click="tabItemClick(item, index)" :key="index">kkk-->
          <!--</tab-item>-->
        <!--</tab>-->
        <tab :line-width="2">
          <tab-item selected>全部</tab-item>
          <tab-item>进行中</tab-item>
          <tab-item>已完成</tab-item>
        </tab>
      </sticky>
    </div>
    <div>
      <group gutter="0" label-width="18rem">
        <swipeout>
          <swipeout-item :threshold=".5" underlay-color="#ccc" v-for="(item, index) in AllList" :key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="editClick(ite)" background-color="#336DD6">修改</swipeout-button>
              <swipeout-button @click.native="deleteClick('delete')" background-color="#D23934">删除</swipeout-button>
            </div>
            <div slot="content" class="list-content" @click="eventView(item)">
              <img slot="icon" width="35" height="35" v-if="item.avatar" class="cellImg"
              :src="item.avatar">
              <div slot="icon" class="cellDiv" v-else>
                {{item.name}}
              </div>
              <div>
                <span>{{item.name + '提出来' + item.event + ',请办理!'}}</span><br>
                <span>{{item.time}}</span>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </group>
    </div>
  </div>
</template>

<script>

  //  import api from 'api'
  // import ding from '@/lib/ding'
  //  import dingUser from '@/lib/dingUser'
  // import { mapGetters } from 'vuex'
  // import whole from '@/lib/whole'

  // let moment = require('moment');
  // const AUTH_DINGTALKCODE = 'auth.dingtalkcode';

  export default {
    data() {
      return {
        AllList: [
          { name: '张三', event: 'OA系统登录不上', time: '2019-01-01' },
          { name: '李四', event: '资金系统登录不上', time: '2019-01-21' },
          { name: '王五', event: '我的系统登录不上', time: '2019-02-9' }
        ]
      }
    },
    computed: {
    },
    watch: {},
    created() {
    },
    methods: {
      eventView(item) {
        alert('事件处理中...')
      }
    }
  }
</script>

<style lang="less" type="text/less">
  .list-content {
    height: 60px!important;
    display: flex;
    justify-content: center;
    align-items: center;
    /*border: 1px solid red;*/
  }
  .cellDiv {
    width: 35px;
    height: 35px;
    line-height: 35px;
    margin-right: 10px;
    font-size: .8rem;
    text-align: center;
    border-radius: 50%;
    color: #FFFFFF;
    background-color: #986526;
  }

  .cellImg {
    display: block;
    margin-right: 10px;
    border-radius: 50%;
  }

  .bottom-load-wrapper {
    line-height: 50px;
    text-align: center;
  }

  .icon-arrow {
    transition: .2s;
    transform: rotate(180deg);
  }

  .icon-loading {
    transform: rotate(0deg);
    animation-name: loading;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .emptyDiv {
    width: 100%;
    height: 500px;
    line-height: 500px;
    overflow: hidden;
    position: relative;
    text-align: center;
    margin: auto
  }

  .emptyDiv img {
    position: static;
    top: -50%;
    left: -50%;
    vertical-align: middle
  }
</style>
