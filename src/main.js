import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'assets/global.css'
import './plugins/element.js'

import tableTree from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.component('table-tree', tableTree)
Vue.use(ElementUi)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

// 时间过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
