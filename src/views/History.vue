<template>
  <el-table
    :data="dailytypeList"
    v-if="dailytypeList.length > 0"
    style="width: 100%;">
    <el-table-column
      fixed
      align="center"
      prop="statime"
      label="日期"
      width="100">
    </el-table-column>
    <el-table-column
      fixed
      align="center"
      prop="address"
      label="地点"
      >
    </el-table-column>
    <el-table-column
      fixed
      align="center"
      prop="ltypetxt"
      label="类型"
      >
    </el-table-column>
    <el-table-column
      fixed
      align="center"
      prop="remarks"
      label="内容"
    >
    </el-table-column>
  </el-table>
</template>

<script>
  import api from '@/api/api'
  import ding from '@/lib/ding'
  export default {
    data() {
      return {
        dailytypeList: []
      }
    },
    created() {
      this.setRight()
      this.getHistroyDailyInfos()
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
      // 获取历史提报信息
      getHistroyDailyInfos () {
        let _that = this
        let sdate = ''
        let edate = _that.edate
        api.getHistroyDailyInfos(sdate, edate, res => {
          if (res.data.code) {
            _that.dailytypeList = res.data.data.dailytypeList
          } else {
            ding.showToast('获取地点失败')
          }
        })
      },
    }
  }
</script>

<style scoped lang="less" type="text/less">
</style>
