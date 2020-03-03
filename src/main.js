import Vue from 'vue'
import App from './App.vue'

import 'vuetify/dist/vuetify.min.css' 
import vuetify from './plugins/vuetify';
import store from './store/store'
import router from './router'


Vue.use(require('vue-moment'));
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
