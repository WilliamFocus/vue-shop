import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/Login.vue'
// import Home from '../views/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import goodList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

// 使用路由懒加载
const Login = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
const Home = () => import( /* webpackChunkName: "login_home_welcome" */ '../views/Home.vue')
const Welcome = () => import( /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

const Users = () => import( /* webpackChunkName: "User_Right_Roles" */ '../components/user/Users.vue')
const Rights = () => import( /* webpackChunkName: "User_Right_Roles" */ '../components/power/Rights.vue')
const Roles = () => import( /* webpackChunkName: "User_Right_Roles" */ '../components/power/roles.vue')

const Cate = () => import( /* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import( /* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

const goodList = () => import( /* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')
const Add = () => import( /* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

const Order = () => import( /* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import( /* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')

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
      },
      {
        path: 'params',
        component: Params
      },
      {
        path: 'goods',
        component: goodList
      },
      {
        path: 'add',
        component: Add
      },
      {
        path: 'orders',
        component: Order
      },
      {
        path: 'reports',
        component: Report
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
