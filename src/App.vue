<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />

    <v-btn
        text
        color="primary"
        v-if="authenticated"
        to="/login"
        v-on:click.native="logout()"
        >Logout</v-btn
      >
      <v-btn text color="primary" v-if="authenticated" to="/dashboard"
        >Dashboard</v-btn
      >
      <v-btn v-if="authenticated" to="/create" text color="primary"
        >Create</v-btn
      >
      <v-btn v-if="authenticated" to="/update" text color="primary">Edit</v-btn>

    <div class="content">
      
      <router-view @authenticated="setAuthenticated" />
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

.create {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}

.content {
  margin-top: 60px;
  margin-bottom: 60px;
  width: 100%;
}
</style>
