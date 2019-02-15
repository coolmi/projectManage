<template>
  <el-table
    :data="tableData"
    v-if="tableData.length > 0"
    style="width: 100%;"
    :height="height">
    <el-table-column
      fixed
      align="center"
      prop="date"
      label="日期"
      :width=twidth1>
    </el-table-column>
    <el-table-column height="20" :label="a.name" align="center" :key="i"  v-for="(a, i) in tableValues">
      <el-table-column
        v-for="(c, index) in a.type"
        :key="index"
        align="center"
        :label="c"
        :width=twidth2
      >
        <template slot-scope="scope">
          {{scope.row[a.key][index]}}
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
  <p v-else style="margin-top: 70px; text-align: center; font-size: 20px; width: 100vw;">暂无数据</p>
</template>

<script>
  import ding from '@/lib/ding'
  import api from '@/api/api'
  import dayjs from 'dayjs'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        queryInfo: 'getQueryInfo'
      })
    },
    data() {
      return {
        height: 250,
        width: '',
        twidth1: '',
        twidth2: '',
        dailytypeList: null,
        tableValues: [
//          {
//            name: '乐文',
//            key: 'lewen',
//            type: ['地点', '内容', '类型'],
//          },
//          {
//            name: '俞芳',
//            key: 'yufang',
//            type: ['地点', '内容', '类型'],
//          },
//          {
//            name: '明月',
//            key: 'mingyue',
//            type: ['地点', '内容', '类型'],
//          }
        ],
        tableData: [
//          {
//            date: '2016-05-03',
//            'lewen': [1, 2, 3],
//            'yufang': [11, 22, 33],
//            'mingyue': [111, 222, 333]
//          },
//          {
//            date: '2016-05-06',
//            'lewen': ['a1','b1','c1'],
//            'yufang': [11, 22, 33],
//            'mingyue': [111, 222, 333]
//          }
        ]
      }
    },
    created() {
      this.height = window.innerHeight - 60 - 20
      this.width = window.innerWidth
      this.twidth1 = this.width / 10 * 3
      this.twidth2 = this.width / 10 * 7 / 3
      console.log(this.twidth)
      console.log(this.width)
      this.getReportDailyInfos()
    },
    methods: {
      // 获取历史提报信息
      getReportDailyInfos() {
        ding.showPreloader('获取报表信息')
        let sdate = dayjs().format('YYYY-MM-DD')
        let edate = dayjs().add(6, 'day').format('YYYY-MM-DD')
        let username = ''
        let ltype = ''
        let address = ''
        if (this.queryInfo != null) {
          sdate = this.queryInfo.sdate
          edate = this.queryInfo.edate
          username = this.queryInfo.username
          ltype = this.queryInfo.ltype
          address = this.queryInfo.address
        }
        let _that = this
        api.getReportDailyInfos(sdate, edate, username, ltype, address, res => {
          ding.hidePreloader()
          if (res.data.code) {
            _that.dailytypeList = res.data.data.dailytypeList
            _that.getTableData()
          } else {
            ding.showToast('获取数据失败')
          }
        })
      },
      getTableData() {
        let tableValues = []
        let tableData = []
        if (this.dailytypeList !== null) {
          Object.keys(this.dailytypeList).forEach(key => {
            let dataArr = this.dailytypeList[key]
            for (let data of dataArr) {
//              let da = {}
//              da.date = key
//              da[data.userid] = [data.address === undefined ? '' : data.address, data.remarks === undefined ? '' : data.remarks, data.ltypetxt === undefined ? '' : data.ltypetxt]
//              tableData.push(da)

              let va = {}
              let flag = this.ifContains(data.userid, tableValues)
              if (!flag) {
                va.key = data.userid
                va.name = data.username
                va.type = ['地点', '内容', '类型']
                tableValues.push(va)
              }
            }
          })
          Object.keys(this.dailytypeList).forEach(key => {
            if (tableValues.length > 0) {
              let da = {}
              da.date = key
              for (let tbv of tableValues) {
                da[tbv.key] = ['', '', '']
                let dataArr = this.dailytypeList[key]
                for (let data of dataArr) {
                  if (data.userid === tbv.key) {
                    da[tbv.key] = [data.address === undefined ? '' : data.address, data.remarks === undefined ? '' : data.remarks, data.ltypetxt === undefined ? '' : data.ltypetxt]
                    break
                  }
                }
              }
              tableData.push(da)
            }
          })
          this.tableValues = tableValues
          this.tableData = tableData
        }
      },
      ifContains(userid, tableValues) {
        let result = false
        for (let tv of tableValues) {
          if (userid === tv.key) {
            result = true
            break
          }
        }
        return result
      }
    }
  }
</script>
<style scoped>
</style>
