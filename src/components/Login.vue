<template>
  <div>
    <button @click="login" class="px-4 py-4">
      Log in with <strong>NOI Authentication</strong>
    </button>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods: {
    login() {
      const redirectPath = window.location.origin + "/";
      this.$keycloak.login({ redirectUri: redirectPath });
    },
  },
};
</script>
