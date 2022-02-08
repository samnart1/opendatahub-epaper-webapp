import Keycloak from 'keycloak-js'

const _keycloak = Keycloak({
  url: process.env.VUE_APP_KEYCLOAK_URL,
  realm: process.env.VUE_APP_KEYCLOAK_REALM,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
});

const Plugin = {
  install(Vue) {
    Vue.$keycloak = _keycloak
    Object.defineProperties(Vue.prototype, {
      $keycloak: {
        get() {
          return _keycloak
        }
      }
    })
  }
}

export default Plugin