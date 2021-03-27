import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
// 设置默认的请求地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器对每次请求携带token
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 挂载到Vue原型对象上，不必为每个.vue文件手动引入axios
Vue.prototype.$http = axios

// 引入第三方树形表格插件
Vue.component('tree-table', TreeTable)

// 时间过滤器
Vue.filter('dateFormat', function dateFormat(date, format) {
  if (typeof date === 'string') {
    var mts = date.match(/(\/Date\((\d+)\)\/)/)
    if (mts && mts.length >= 3) {
      date = parseInt(mts[2])
    }
  }
  date = new Date(date)
  if (!date || date.toUTCString() === 'Invalid Date') {
    return ''
  }
  var map = {
    M: date.getMonth() + 1, // 月份
    d: date.getDate(), // 日
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    var v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })
  return format
})

// 注册文本编辑插件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
