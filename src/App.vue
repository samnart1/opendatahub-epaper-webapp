 
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />

    <div class="content">
      <b-card title="Card Title" no-body>
        <b-card-header header-tag="nav">
          <b-nav card-header tabs>
            <b-nav-item
              v-if="authenticated"
              to="/login"
              v-on:click.native="logout()"
              replace
              >Logout</b-nav-item
            >
            <b-nav-item   v-if="authenticated" to="/displays" exact exact-active-class="active"
              >Displays</b-nav-item
            >
            <b-nav-item  v-if="authenticated" to="/locations" exact exact-active-class="active"
              >Locations</b-nav-item
            >
            <b-nav-item   v-if="authenticated" to="/templates" exact exact-active-class="active"
              >Templates</b-nav-item
            >
          </b-nav>
        </b-card-header>
        <b-card-body class="text-center">
          <router-view @authenticated="setAuthenticated" />
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      authenticated: false,
      mockAccount: {
        username: "user",
        password: "pass"
      }
    };
  },
  mounted() {
    if (!this.authenticated) {
      this.$router.replace({ name: "login" });
    }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
    },
    logout() {
      this.authenticated = false;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.content {
  margin-top: 60px;
  margin-bottom: 60px;
  margin-left: 10%;
  width: 80%;
}
</style>
