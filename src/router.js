import Vue from 'vue';
import Router from 'vue-router';
import ding from '@/lib/ding'
// import store from '@/store'
// import base from '@/api/baseConfig'

Vue.use(Router);

let dd = window.dd

// 滚动行为
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {}
    if (to.hash) {
      position.selector = to.hash
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0
      position.y = 0
    }
    return position
  }
}

const router = new Router({
  // base: '/rctb/',
  mode: 'history',
  scrollBehavior,
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home'),
      meta: {
        ddConfig: true
      }
    },
    {
      path: '/h',
      component: () => import('@/views/HomePage'),
      meta: {
        ddConfig: true
      }
    },
    {
      path: '/q',
      component: () => import('@/views/Query'),
      children: [
        {
          path: '/',
          name: 'table',
          component: () => import('@/views/Table')
        }
      ]
    },
    {
      path: '/qc',
      name: 'QueryContent',
      component: () => import('@/views/QueryContent'),
      meta: {
        ddConfig: true
      }
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('@/views/History')
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.pullToRefresh) {
    dd.ui.pullToRefresh.enable()
  } else {
    dd.ui.pullToRefresh.disable()
  }
  if (to.meta.ddConfig) { // 如果ddConfig为ture 则进行授权jsAPI
    setDDConfig(to)
  }
  typeof to.meta.title && setDocumentTitle(to.meta.title) // 设置title
  next();
});

let setDocumentTitle = function (title) {
  if (title !== undefined) {
    let config = {
      title: title
    }
    dd.ready(function () {
      dd.biz.navigation.setTitle(config);
    });
    dd.error(function (err) {
      console.error('dd setTitle error: ' + window.location.href + JSON.stringify(err));
    });
  }
};

let setDDConfig = function (to) {
  // let path = store.state.ddstate.ddConfigPath || base.baseURL
  let path = location.href
  ding.jsApiOAuth(path).then((ddconfig) => {
    dd.config(ddconfig)
  }).catch(function (error) {
    // TODO 错误信息提示
    // ding.alertInfo(DEM.ddConfigInfoError);
  });
}

export default router;
