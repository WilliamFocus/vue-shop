import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/Cate.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [{
        path: '/home',
        redirect: '/home/welcome'
      },
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        component: Users
      },
      {
        path: 'rights',
        component: Rights
      },
      {
        path: 'roles',
        component: Roles
      },
      {
        path: 'categories',
        component: Cate
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
