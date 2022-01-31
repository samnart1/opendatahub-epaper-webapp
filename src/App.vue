 
<template>
  <div id="app">
    <div v-if="username" class="topbar">
      <img class="logo" alt="Vue logo" src="./assets/logo_bn.svg" />
      <div class="routerHeader">
        <h3>{{siteName}}</h3>
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
          <b-nav-item v-if="username" to="/login" v-on:click="logout()" replace
            >Logout</b-nav-item
          >
        </div>
      </b-nav>
    </div>
    <div v-else>
      <img class="bigLogo"  alt="Vue logo" src="./assets/logo.png" />
      
      <h3 >{{siteName}}</h3>
   
    </div>

    <div class="content">
      <b-card title="Card Title" no-body>
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
      username: null,
      mockAccount: {
        username: "user",
        password: "pass",
      },
      routes: [
        { name: "Displays", link: "/displays" },
        { name: "Locations", link: "/locations" },
        { name: "Templates", link: "/templates" },
      ],
      siteName: "eInk Display management site"
    };
  },
  computed: {
    currentRouteName() {
      if (this.routes.some((e) => e.name === this.$route.name)) {
        return this.$route.name;
      }
      return "";
    },
  },
  mounted() {
    this.username = localStorage.getItem("user");
    if (!this.username) {
      this.$router.replace("/login");
    }
  },
  methods: {
    setAuthenticated() {
      this.username = localStorage.getItem("user");
      this.$router.replace({ name: "Displays" });
    },
    logout() {
      this.username = null;
      localStorage.removeItem("user");
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
