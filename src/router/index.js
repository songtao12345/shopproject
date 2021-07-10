import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/Login'
import Home from 'components/Home'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 路由导航守卫，判断token是否存在
router.beforeEach((to,from,next) => {
  //判断要访问的路径是不是Login  是的话直接放行
 if(to.path === '/login') return next()
 // 获取 token值
 const tokenValue = window.sessionStorage.getItem('token')
 // 如果token不存在，则直接强制跳转到/login，存在的话直接放行
 if(!tokenValue) return next('/login')
 next()
})

export default router
