import routes from './routes';
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router';
import axios from 'axios';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// 拦截push异常
const originalPush = router.push;
router.push = function(location) {
  return originalPush.call(this, location).catch(err => err);
};

// 拦截replace异常
const originalReplace = router.replace;
router.replace = function(location) {
  return originalReplace.call(this, location).catch(err => err);
};

router.beforeEach((to, from, next) => {
  // 路由跳转时 取消所有旧请求
  axios.prototype.axiosPromiseArr.forEach((ele, index) => {
    ele.cancel();
    delete axios.prototype.axiosPromiseArr[index];
  });
  let token = localStorage.getItem('token');
  if (token) {
    if (
      to.matched.some((record) => record.meta.loginBefore)
    ) {
      next('/');
    }
  } else {
    if (
      to.matched.some((record) => record.meta.loginAfter)
    ) {
      if (
        from.matched.some(
          (record) => record.path === '/login',
        )
      ) {
        // 防止死循环
        next(false);
      } else {
        next({
          path: '/login',
        });
      }
    }
  }
  next();
});

router.afterEach((to, from, next) => {});

export default router;
