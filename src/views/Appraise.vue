<template>
  <div class="page_">
    <!--<selector class="sele" placeholder="请选择" title="产品*" :options="Plist" v-model="product"></selector>-->
    <!--<datetime class="dat" v-model="time" title="接收时间*"></datetime>-->
    <x-textarea :max="20" placeholder="请输入简述" v-model="describes" title="简述"></x-textarea>
    <x-textarea :max="20" placeholder="请输入问题描述" v-model="describes" title="问题描述"></x-textarea>
    <x-textarea :max="20" placeholder="请输入解决方案" v-model="describes" title="解决方案"></x-textarea>
    <x-input title="业务处理人" v-model="person"></x-input>
    <div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        product: '',
        time: '',
        describes: '',
        person: '',
        develop: '',
        Plist: [
          { key: '苹果', value: '苹果' },
          { key: '香蕉', value: '香蕉' },
          { key: '橘子', value: '橘子' }
        ]
      }
    },
    computed: {
    },
    watch: {},
    created() {
    },
    methods: {
    }
  }
</script>

<style lang="less" type="text/less">
  .page_ {
    margin-top: 10px;
    width: 100%;
  }
  .sele>.weui-cell__bd>.weui-select{
    float: right;
    width: 200px;
  }
  .dat>.weui-cell__ft>.vux-cell-value {
    float: right;
    display: inline-flex;
    width: 180px;
  }
  .red {
    color: red;
  }
</style>
