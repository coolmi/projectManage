<template>
  <transition name="fade">
    <div>
      <group title="请选择日期" title-color="#000000">
        <flexbox>
          <flexbox-item>
            <datetime title="开始" v-model="begin" :start-date="begin"></datetime>
          </flexbox-item>
          <flexbox-item>
            <datetime title="结束" v-model="end" :start-date="begin"></datetime>
          </flexbox-item>
        </flexbox>
      </group>
      <group title="请选择人员" title-color="#000000" style="margin-top: 2rem">
        <div class="cyspan" v-for="(per, index) in userlist" :key="per.emplId" @click="delPerson(per, index)">{{per.name | getName}}</div>
        <div class="cyspan" @click="checkPerson">+</div>
      </group>
      <group title="请选择工作类型" title-color="#000000" style="margin-top: 2rem">
        <checker
          v-model="ltype"
          class="lx_checker"
          default-item-class="lx_checker-item"
          selected-item-class="lx_checker-item-selected"
        >
          <checker-item v-for="i in typeArr" :key="i.value" :value="i.value">{{i.label}}</checker-item>
        </checker>
      </group>
      <group title="请选择工作地点" title-color="#000000" style="margin-top: 2rem">
        <checker
          class="dd_checker"
          v-model="address"
          type="checkbox"
          default-item-class="dd_checker-item"
          selected-item-class="dd_checker-item-selected"
        >
          <checker-item v-for="i in addressArr" :key="i.address" :value="i.address">{{i.address}}</checker-item>
        </checker>
      </group>
      <box gap="10px 10px">
        <flexbox>
          <flexbox-item>
            <x-button plain type="primary" @click.native="saveQueryContent">确定</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button plain type="primary" @click.native="resetQueryContent">重置</x-button>
          </flexbox-item>
        </flexbox>
      </box>
    </div>
  </transition>
</template>

<script>
  import ding from '@/lib/ding'
  import api from '@/api/api'
  import dayjs from 'dayjs'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        begin: dayjs().format('YYYY-MM-DD'),
        end: dayjs().add(6, 'day').format('YYYY-MM-DD'),
        ltype: '',
        address: '',
        typeArr: [],
        addressArr: [],
        pickedUsers: [],
        userlist: []
      }
    },
    computed: {
      ...mapGetters({
        queryInfo: 'getQueryInfo'
      })
    },
    created() {
      this.getDailytype();
      this.getAddress();
      this.setRight();
      if (this.queryInfo != null) {
        this.begin = this.queryInfo.sdate
        this.end = this.queryInfo.edate
        this.userlist = this.queryInfo.userlist
        this.ltype = this.queryInfo.ltype
        this.address = this.queryInfo.address
      }
    },
    methods: {
      setRight() {
        let dd = window.dd;
        let _that = this;
        dd.biz.navigation.setRight({
          show: true,
          control: true,
          text: '确定',
          onSuccess: function(result) {
            _that.saveQueryContent()
          },
          onFail: function(err) {}
        })
      },
      saveQueryContent() {
        let person = ''
        if (this.userlist.length > 0) {
          for (let user of this.userlist) {
            person += user.itcode + ','
          }
        }
        let queryInfo = {
          'userlist': this.userlist,
          'address': this.address,
          'sdate': this.begin,
          'edate': this.end,
          'ltype': this.ltype,
          'username': person.substring(0, person.length - 1)
        }
        this.$store.dispatch('saveQueryContent', queryInfo)
        this.$router.go(-1)
      },
      resetQueryContent() {
        this.begin = dayjs().format('YYYY-MM-DD')
        this.end = dayjs().add(6, 'day').format('YYYY-MM-DD')
        this.userlist = []
        this.ltype = ''
        this.address = ''
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
      getAddress() {
        ding.showPreloader('加载设置信息')
        let _that = this
        api.getAddressInfos(res => {
          ding.hidePreloader()
          if (res.data.code) {
            _that.addressArr = res.data.data.addresslist
          }
        })
      },
      checkPerson() {
        let dd = window.dd
        let _that = this
        dd.ready(function () {
          dd.biz.contact.complexPicker({
            title: '选择人员',
            corpId: ding.CORPID,
            multiple: true,
            limitTips: '请选择人员',
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
          alert(JSON.stringify(err))
        });
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
      }
    },
    filters: {
      getName(data) {
        return data.substr(data.length - 2)
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../styles/pro/queryContent";
</style>
