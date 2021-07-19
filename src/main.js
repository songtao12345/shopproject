import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'assets/global.css'
import './plugins/element.js'

import tableTree from 'vue-table-with-tree-grid'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.component('table-tree', tableTree)
Vue.use(ElementUi)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
