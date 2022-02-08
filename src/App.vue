 
<template>
  <div id="app">
    <div v-if="authenticated" class="topbar">
      <img class="logo" alt="Vue logo" src="./assets/logo_bn.svg" />
      <div class="routerHeader">
        <h3>{{ siteName }}</h3>
        <h4 v-if="currentRouteName">{{ currentRouteName }}</h4>
      </div>
      <b-nav class="navbar">
        <b-nav-item
          v-for="route in routes"
          :to="route.link"
          :key="route.link"
          exact
          exact-active-class="active"
          >{{ route.name }}</b-nav-item
        >
        <div class="userBox">
          Hi, {{ username }}
          <b-nav-item v-if="username" v-on:click="logout()">Logout</b-nav-item>
        </div>
      </b-nav>
    </div>
    <div v-else>
      <img class="bigLogo" alt="Vue logo" src="./assets/logo.png" />
      <h3>{{ siteName }}</h3>
    </div>

    <div class="content">
      <b-card title="Card Title" no-body>
        <b-card-body class="text-center">
          <router-view />
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
      username: null, 
      routes: [
        { name: "Displays", link: "/displays" },
        { name: "Locations", link: "/locations" },
        { name: "Templates", link: "/templates" },
      ],
      siteName: "eInk Display management site",
    };
  },
  computed: {
    currentRouteName() {
      if (this.routes.some((e) => e.name === this.$route.name)) {
        return this.$route.name;
      }
      return "";
    },
    authenticated() {
      return this.$store.state.authenticated;
    }
  },
  mounted() {
    if (this.authenticated) {
      this.$keycloak.loadUserInfo().then((info) => {
        this.username = info.name;
      });
    } 
  },
  methods: {
    logout() {
      const redirectPath = window.location.origin + "/";
      this.$keycloak.logout({ redirectUri: redirectPath });
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.content {
  margin-top: 20px;
}

.topbar {
  height: 75px;
}

.navbar {
  float: right;
}

.logo {
  margin-left: 20px;
  margin-top: 8px;
  float: left;
}

.bigLogo {
  margin-bottom: 25px;
}

.routerHeader {
  float: left;
  text-align: left;
  margin-left: 30px;
}

.userBox {
  border-radius: 8px;
  border: 2px solid #aaaaaa;
}
</style>
