import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home/Home.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/cve',
      children: [
        // 会话
        {
          path: '/cve',
          name: 'cve',
          components: {
            default: () => import('@/views/Home/Cve/CveList.vue'),
            right: () => import('@/views/Home/Cve/ChatPage.vue'),
          },
        },
        {
          path: '/contacts',
          name: 'contacts',
          components: {
            default: () => import('@/views/Home/Contact/ContactList.vue'),
            right: () => import('@/views/Home/Contact/ContactRight.vue'),
          },
        },
        {
          path: '/profile',
          name: 'profile',
          components: {
            default: () => import('@/views/Home/Profile/Profile.vue'),
          },
        },
      ],
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/Index.vue'),
    },
  ],
});

const allowPath = ['/', '/cve', '/contacts', '/profile'];

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem(`improfile`);
  if (to.path === '/login' && isLogin) {
    // 登陆了不允许再进去 登录页面
    next('/cve');
  } else if (allowPath.some((item) => item === to.path) && !isLogin) {
    next('/login');
  } else {
    next();
  }
});

export default router;
