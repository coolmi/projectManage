<template>
  <div>
    <transition name="fade">
      <div class="selectDate">
        <div class="selectDate-showDate">
          <!--<div @click="getDate(begin, end)">{{begin + '至' + end}}</div>-->
          <div @click="showDate = !showDate">{{begin + ' 至 dee' + end}}</div>
          <!--<img src="@/assets/images/zk.png" @click="showRctb = true" v-if="showRctb === false">-->
          <!--<img src="@/assets/images/zd.png" @click="showRctb = false" v-else-if="showRctb === true">-->
        </div>
        <div v-transfer-dom>
          <popup v-model="showDate" max-height="50%">
            <div class="selectDate-group">
              <div class="selectDate-group-date">
                <datetime-view v-model="begin" ref="datetime" :format="formatDate"></datetime-view>
              </div>
              <span class="selectDate-group-span">至</span>
              <div class="selectDate-group-date">
                <datetime-view v-model="end" ref="datetime" :format="formatDate"></datetime-view>
              </div>
            </div>
          </popup>
        </div>
      </div>
    </transition>
    <div style="margin-bottom: 60px; -webkit-overflow-scrolling: touch;">
      <group style="margin-top: 60px">
        <cell
          title="日程填报"
          is-link
          :border-intent="false"
          :arrow-direction="showRctb ? 'up' : 'down'"
          @click.native="showRctb = !showRctb"></cell>
        <template v-if="showRctb">
          <group label-width="5em" label-margin-right="1em" v-for="(item, index) in tbdata" :key="index">
            <group-title slot="title" class="groupTitle">
              <span>{{item.statime}}</span>
              <span style="float:right; margin-right: 6px;" v-if="item.flag !== ''">{{item.flag === '0' ? '草稿' : '提报'}}</span>
              <!--<span style="float:right;color: #986526" @click="zt(index)">粘贴</span>-->
              <!--<span style="float:right;margin-right: 10px;" @click="fz(item, index)">复制</span>-->
            </group-title>
            <x-input title="地点：" v-model="item.address"></x-input>
            <x-textarea title="工作事项：" :max="max" v-model="item.remarks"></x-textarea>
            <checker
              v-model="item.ltype"
              class="checker"
              default-item-class="checker-item"
              selected-item-class="checker-item-selected"
            >
              <checker-item v-for="i in typeArr" :key="i.value" :value="i.value">{{i.label}}</checker-item>
            </checker>
          </group>
        </template>
      </group>
      <group>
        <div class="cytitle">日程接收人<span style="margin-left:8px;font-size: 12px; color: #B2B2B2">点击头像即可删除添加的人员</span></div>
        <div class="cyspan" v-for="per in personArr" :key="per.value">{{per.label | getName}}</div>
        <div class="cyspan" v-for="(per, index) in userlist" :key="index" @click="delPerson(per, index)">{{per.name | getName}}</div>
        <div class="cyspan" @click="checkPerson">+</div>
      </group>
      <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="saveDaily(0)">保存</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button :gradients="['#FF5E3A', '#FF9500']" @click.native="saveDaily(1)">提报</x-button>
        </flexbox-item>
      </flexbox>
      </box>
    </div>
    <tabbar style="position: fixed;padding-bottom: constant(safe-area-inset-bottom);">
      <tabbar-item selected>
        <img slot="icon" src="../assets/images/rc_active.png">
        <span slot="label">提报</span>
      </tabbar-item>
      <tabbar-item @on-item-click="tjClick">
        <img slot="icon" src="../assets/images/tj.png">
        <span slot="label">统计</span>
      </tabbar-item>
    </tabbar>
    <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :text="toastmsg" position="middle">{{toastmsg}}</toast>
  </div>
</template>

<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'

  import dayjs from 'dayjs'
  import baseConfig from '@/api/baseConfig'
  import utils from '@/lib/utils'
  import ding from '@/lib/ding'
  import api from '@/api/api'

  const format = 'YYYY-MM'
  const formatDate = 'YYYY-MM-DD'

  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        max: 50,
        showRctb: false,
        showJsr: false,
        showDate: false,
        begin: dayjs().format(formatDate),
        end: dayjs().add(6, 'day').format(formatDate),
        format: format,
        formatDate: formatDate,
        tbdata: [],
        typeArr: [
          {
            "label": "出差",
            "value": "0"
          },
          {
            "label": "工作",
            "value": "1"
          },
          {
            "label": "休假",
            "value": "2"
          }
        ],
        personArr: [],
        pickedUsers: [], // 控件已选择的人
        userlist: [], // 请求的人
        dailytypeList: null,
        showPositionValue: false,
        toastmsg: ''
      }
    },
    watch: {
      begin(val) {
        this.getBetweenDate(val, this.end)
      },
      end(val) {
        this.getBetweenDate(this.begin, val)
      }
    },
    created() {
      this.setRight();
      this.getDailytype();
      this.getDefaultPerson();
      this.getDailyInfosByUseidAndSdateAndEdate(this.begin, this.end)
      this.getBetweenDate(this.begin, this.end)
    },
    methods: {
      setRight() {
        let dd = window.dd;
        let _that = this;
        dd.biz.navigation.setRight({
          show: true,
          control: true,
          text: '历史',
          onSuccess: function(result) {
            _that.$router.push('/history')
          },
          onFail: function(err) {}
        })
      },
      // 获取工作类型
      getDailytype() {
        ding.showPreloader('加载设置信息')
        let _that = this
        api.getDailytype(res => {
          ding.hidePreloader()
          if (res.data.code) {
            _that.typeArr = res.data.data.dailytypeList
          }
        })
      },
      // 获取默认人员
      getDefaultPerson() {
        let _that = this
        api.getDefaultPerson(res => {
          if (res.data.code) {
            _that.personArr = res.data.data.dailytypeList
          }
        })
      },
      // 保存
      saveDaily(flag) {
        let _that = this
        let person = ''
        let persontxt = ''
        if (this.userlist.length > 0) {
          for (let user of this.userlist) {
            person += user.itcode + ','
            persontxt += user.name + ','
          }
        }
        let dailyapp = {
          'isforward': flag,
          'person': person.substring(0, person.length - 1),
          'persontxt': persontxt.substring(0, persontxt.length - 1),
          'sdate': new Date(this.begin).getTime(),
          'edate': new Date(this.end).getTime()
        }
        let p = {}
        p.dailyapp = dailyapp
        p.dailyinfos = _that.tbdata
        api.saveDaily(JSON.stringify(p), res => {
          if (res.data.code && flag === 0) {
            _that.toastmsg = '保存成功'
            _that.showPositionValue = true
            _that.getDailyInfosByUseidAndSdateAndEdate(_that.begin, _that.end)
          } else if (res.data.code && flag === 1) {
            _that.toastmsg = '提报成功'
            _that.showPositionValue = true
            _that.getDailyInfosByUseidAndSdateAndEdate(_that.begin, _that.end)
          } else {
            _that.toastmsg = res.data.message
          }
        })
      },
      // 获取历史信息
      getDailyInfosByUseidAndSdateAndEdate(dateStr, dateEnd) {
//        ding.showPreloader('加载历史记录')
        let _that = this
        api.getDailyInfosByUseidAndSdateAndEdate(dateStr, dateEnd, res => {
//          ding.hidePreloader()
          if (res.data.code) { // 判断提报人是否为空
            _that.dailytypeList = res.data.data.dailytypeList
            let ddidmap = res.data.data.ddidmap
            if (JSON.stringify(ddidmap) === {} || JSON.stringify(ddidmap) === '{}') {
              _that.userlist = []
            } else {
              for (let dtl of _that.dailytypeList) {
                let xpersonArr = dtl.xperson.split(',')
                let xpersonTxtArr = dtl.xpersontxt.split(',')
                for (let xp in xpersonArr) {
                  if (_that.pickedUsers.indexOf(ddidmap[xpersonArr[xp]]) < 0) {
                    _that.pickedUsers.push(ddidmap[xpersonArr[xp]])
                    let user = {}
                    user.itcode = xpersonArr[xp]
                    user.emplId = ddidmap[xpersonArr[xp]]
                    user.name = xpersonTxtArr[xp]
                    _that.userlist.push(user)
                  }
                }
              }
            }
            _that.getHistoryData()
          }
        })
      },
      getHistoryData() {
        if (this.tbdata.length > 0) {
          for (let tb in this.tbdata) {
            if (this.dailytypeList !== null && this.dailytypeList.length > 0) {
              for (let dyl of this.dailytypeList) {
                if (dyl.statime === this.tbdata[tb].statime) {
                  this.tbdata[tb].address = dyl.address
                  this.tbdata[tb].remarks = dyl.remarks
                  this.tbdata[tb].ltype = dyl.ltype
                  this.tbdata[tb].flag = dyl.flag
                }
              }
            }
          }
        }
      },
      getDate (begin, end) {
        let dd = window.dd
        dd.biz.calendar.chooseInterval({
          defaultStart: new Date(begin).getTime(),
          defaultEnd: new Date(end).getTime(),
          onSuccess: function(result) {
            // onSuccess将在点击确定之后回调
            /*
            {
                start: 1514908800000,
                end: 1514995200000,
                timezone:8
            }
            */
          },
          onFail: function(err) {}
        })
      },
      getBetweenDate(begin, end) {
        let _that = this
        let format = 'YYYY-MM-DD'
        let nowday = dayjs(_that.begin).diff(dayjs(), 'day')
        if (nowday < 0) {
          alert('开始时间应大于等于当前时间')
          _that.begin = dayjs().format(format)
          begin = _that.begin
        }
        let daydiff = dayjs(end).diff(dayjs(begin), 'day')
        if (daydiff < 0) {
          alert('结束日期要大于开始日期')
          _that.begin = dayjs().format(format)
          begin = _that.begin
          _that.end = dayjs(_that.begin).add(6, 'day').format(format)
          end = _that.end
        }
        if (daydiff > 31) {
          _that.end = dayjs(_that.begin).add(30, 'day').format(format)
          end = _that.end
        }
        let result = []
        let betweenDates = utils.getDaysBetween(begin, end)
        for (let d of betweenDates) {
          let item = {}
          if (this.tbdata.length > 0) {
            let ifcontains = false
            let index = 0
            for (let tb in this.tbdata) {
              if (d === this.tbdata[tb].statime) {
                ifcontains = true
                index = tb
              }
            }
            if (ifcontains) {
              result.push(this.tbdata[index])
            } else {
              item.statime = d
              item.address = ''
              item.remarks = ''
              item.ltype = ''
              item.flag = ''
              result.push(item)
            }
          } else {
            item.statime = d
            item.address = ''
            item.remarks = ''
            item.ltype = ''
            item.flag = ''
            result.push(item)
          }
        }
        this.tbdata = result
        this.getHistoryData()
        this.getDailyInfosByUseidAndSdateAndEdate(begin, end)
      },
      fz(item, index) {
        let info = JSON.parse(JSON.stringify(item))
        this.$store.dispatch('saveRcInfo', info)
        let dd = window.dd
        dd.device.notification.toast({
          text: '复制成功', //提示信息
          duration: 1, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
          onSuccess: function (result) {
            /*{}*/
          },
          onFail: function (err) {
          }
        })
      },
      zt(index) {
        let item = this.$store.state.item.info
        this.tbdata[index].address = item.address
        this.tbdata[index].remarks = item.remarks
        this.tbdata[index].ltype = item.ltype
      },
      tjClick() {
//        window.location.href = baseConfig.baseURL + '/q?dd_orientation=landscape'
        this.$router.push('/q?dd_orientation=landscape')
      },
      delPerson(per, index) {
        this.pickedUsers.splice(this.pickedUsers.indexOf(per.emplId), 1)
        let userIndex = null
        for (let u in this.userlist) {
          if (this.userlist[u].emplId === per.emplId) {
            userIndex = u
            break;
          }
        }
        if (userIndex !== null) {
          this.userlist.splice(userIndex, 1)
        }
      },
      checkPerson() {
        let dd = window.dd
        let _that = this
        dd.ready(function () {
          dd.biz.contact.complexPicker({
            title: '选择人员',
            corpId: ding.CORPID,
            multiple: true,
            limitTips: '请选择要提交给的人员',
            maxUsers: 1000,
            pickedUsers: _that.pickedUsers,
            appId: 223447773,
            permissionType: 'GLOBAL',
            responseUserOnly: true,
            startWithDepartmentId: 0,
            onSuccess: function (result) {
              result.users.forEach(function (item) {
                _that.pickedUsers.push(item.emplId)
                api.getUserInfoDdid(item.emplId, res => {
                  if (res.data.code && !(res.data.itcode === undefined || res.data.itcode === null)) {
                    let itcode = res.data.itcode
                    let user = {
                      'itcode': itcode,
                      'emplId': item.emplId,
                      'name': item.name
                    }
                    if (_that.userlist.length > 0) { // 存在
                      let index = null
                      for (let ul in _that.userlist) {
                        if (_that.userlist[ul].itcode === user.itcode) {
                          index = ul
                          break
                        }
                      }
                      if (index === null) {
                        _that.userlist.push(user)
                      }
                    } else { // 第二次
                      _that.userlist.push(user)
                    }
                  } else {
                    console.log(res.data.name + '获取itcode失败')
                  }
                })
              })
            },
            onFail: function (err) {
              _that.showmessage = '获取数据失败'
              _that.show = true
            }
          });
        })
        dd.error(function (err) {
//          alert(JSON.stringify(err))
        });
      }
    },
    filters: {
      getName(data) {
        if (data.indexOf('-') > 0) {
          data = data.split('-')[0]
        }
        return data.substr(data.length - 2)
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../styles/pro/home";
</style>
