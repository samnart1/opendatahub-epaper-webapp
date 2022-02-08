import Vue from 'vue'
import App from './App.vue'

import store from './store/store'
import router from './router'
import keycloak from './plugins/keycloak'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(keycloak)
Vue.use(require('vue-moment'));
Vue.config.productionTip = false

Vue.$keycloak
  .init({
    onLoad: "check-sso",
    silentCheckSsoRedirectUri:
      window.location.origin + "/silent-check-sso.html",
  })
  .then((authorized) => {

    new Vue({
      router,
      store,
      created() {
        if (authorized) {
          this.$store.dispatch('setAuthenticated', true);
          this.$store.dispatch('setToken', Vue.$keycloak.token);
          this.$store.dispatch('loadData');

          setInterval(() => {
            Vue.$keycloak.updateToken(70).then(() => {
              this.$store.dispatch('setToken', Vue.$keycloak.token)
            }).catch(() => {
              this.$store.dispatch('setAuthenticated', false);
              if (keycloak.token) {
                // Application has still an invalid token. Let's clear it.
                Vue.$keycloak.clearToken();
              }
            });
          }, 6000);
        }
      },
      render: h => h(App)
    }).$mount('#app')
  })




