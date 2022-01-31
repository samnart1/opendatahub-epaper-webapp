<template>
  <div v-on:keyup.enter="login()" class="w-25 mx-auto" >
    <b-card title="Login"  >
      <b-card-text>
        <b-form-input v-model="input.username" placeholder="username" />
        <b-form-input type="password" v-model="input.password" placeholder="password" />

        <b-button variant="success" v-on:click="login()">Login</b-button>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {
        username: null,
        password: null
      }
    };
  },
  methods: {
    login() {
      if (this.input.username != "" && this.input.password != "") {
        if (
          this.input.username == this.$parent.mockAccount.username &&
          this.input.password == this.$parent.mockAccount.password
        ) {
          
          localStorage.setItem('user', this.input.username);
          this.$emit("authenticated");
        }
      }
    }
  }
};
</script>
