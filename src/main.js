import Vue from 'vue'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vuetify from './plugins/vuetify';
import store from './store/store'
import router from './router'

Vue.use(BootstrapVue)
Vue.use(vuetify)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  created () {
    this.$store.dispatch('loadData')
  },
  render: h => h(App)
}).$mount('#app')
