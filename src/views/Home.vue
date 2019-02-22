<template>
  <div>
    <div style="height:44px;">
      <button-tab class="top_but" v-model="selectedIndex">
        <button-tab-item :selected="selectedIndex === index" v-for="(item, index) in tabList"
                  @click.native="tabItemClick(index)" :key="index">{{item.name}}
        </button-tab-item>
      </button-tab>
    </div>
    <!--全部-->
    <div v-if="selectedIndex === 0 && AllList.length > 0">
        <swipeout>
          <swipeout-item :threshold=".5" transition-mode="follow" v-for="item in AllList" :key="item.id">
            <!--<div slot="right-menu">-->
              <!--<swipeout-button @click.native="editClick(item)" background-color="#336DD6">修改</swipeout-button>-->
              <!--<swipeout-button @click.native="deleteClick(item)" background-color="#D23934">删除</swipeout-button>-->
            <!--</div>-->
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
    </div>
    <div v-if="selectedIndex === 0 && AllList.length < 0" class="emptyDiv">
      <img src="/static/image/zwsj.png">
    </div>
    <!--进行中-->
    <div v-if="selectedIndex === 1 && IngList.length > 0">
        <swipeout>
          <swipeout-item :threshold=".5" underlay-color="#ccc" v-for="item in IngList" :key="item.id">
            <div slot="right-menu">
              <swipeout-button @click.native="editClick(item)" background-color="#336DD6">修改</swipeout-button>
              <swipeout-button @click.native="deleteClick(item)" background-color="#D23934">删除</swipeout-button>
            </div>
            <div slot="content" class="list-content" @click="eventView(item)">
              <img slot="icon" width="35" height="35" v-if="item.avatar" class="cellImg"
                   :src="item.avatar">
              <div slot="icon" class="cellDiv" v-else>
                {{item.name}}
              </div>
              <div>
                <span>{{item.name + '提出来' + item.event + ',办理中!'}}</span><br>
                <span>{{item.time}}</span>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
    </div>
    <div v-if="selectedIndex === 1 && IngList.length < 0" class="emptyDiv">
      <img src="/static/image/zwsj.png">
    </div>
    <!--已完成-->
    <div v-if="selectedIndex === 2 && FinishList.length > 0">
        <swipeout>
          <swipeout-item :threshold=".5" underlay-color="#ccc" v-for="item in FinishList" :key="item.id">
            <!--<div slot="right-menu">-->
              <!--<swipeout-button @click.native="editClick(item)" background-color="#336DD6">修改</swipeout-button>-->
              <!--<swipeout-button @click.native="deleteClick(item)" background-color="#D23934">删除</swipeout-button>-->
            <!--</div>-->
            <div slot="content" class="list-content" @click="eventView(item)">
              <img slot="icon" width="35" height="35" v-if="item.avatar" class="cellImg"
                   :src="item.avatar">
              <div slot="icon" class="cellDiv" v-else>
                {{item.name}}
              </div>
              <div>
                <span>{{item.name + '提出来' + item.event + ',已完成!'}}</span><br>
                <span>{{item.time}}</span>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
    </div>
    <div v-if="selectedIndex === 2 && FinishList.length < 0" class="emptyDiv">
      <img src="/static/image/zwsj.png">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selectedIndex: 0,
        tabList: [
          { name: '全部' },
          { name: '进行中' },
          { name: '已完成' }
        ],
        AllList: [
          { id: '1', name: '张三', event: 'OA系统登录不上', time: '2019-01-01', type: '0' },
          { id: '2', name: '李四', event: '资金系统登录不上', time: '2019-01-21', type: '0' },
          { id: '3', name: '王五', event: '我的系统登录不上', time: '2019-02-9', type: '0' }
        ],
        IngList: [
          { id: '4', name: '张三', event: 'OA系统登录不上', time: '2019-01-01', type: '1' },
          { id: '5', name: '李四', event: '资金系统登录不上', time: '2019-01-21', type: '1' },
          { id: '6', name: '王五', event: '我的系统登录不上', time: '2019-02-9', type: '1' }
        ],
        FinishList: [
          { id: '7', name: '张三', event: 'OA系统登录不上', time: '2019-01-01', type: '2' },
          { id: '8', name: '李四', event: '资金系统登录不上', time: '2019-01-21', type: '2' },
          { id: '9', name: '王五', event: '我的系统登录不上', time: '2019-02-9', type: '2' }
        ]
      }
    },
    computed: {
    },
    watch: {},
    created() {
    },
    methods: {
      tabItemClick(index) {
        this.selectedIndex = index;
      },
      eventView(item) {
        alert('事件处理中...');
      },
      editClick(item) {
        this.$router.push('/Appraise')
      },
      deleteClick(item) {
        let dd = window.dd
        dd.device.notification.confirm({
          message: '确认删除?',
          title: '提示',
          buttonLabels: ['确认', '取消'],
          onSuccess: function(result) {
            console.log(JSON.stringify(result))
            if (result.buttonIndex === 0) {
              dd.device.notification.toast({
                text: '删除成功', // 提示信息
                duration: 1, // 显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                onSuccess: function (result) {
                },
                onFail: function (err) {
                }
              })
            }
          },
          onFail: function(err) {}
        });
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
  .top_but {
    margin: 10px 5px 0 5px;
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
