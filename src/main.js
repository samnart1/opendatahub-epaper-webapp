import Vue from 'vue'
import App from './App.vue'

import store from './store/store'
import router from './router'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(require('vue-moment'));
Vue.config.productionTip = false

new Vue({
  router,
  store,
  created () {
    this.$store.dispatch('loadData')
  },
  render: h => h(App)
}).$mount('#app')
