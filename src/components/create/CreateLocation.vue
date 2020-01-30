<template>
  <div class="create">
    <v-card width="400px">
      <v-card-title>
        Create Location
      </v-card-title>
      <v-card-text>
        <form @submit.prevent="createLocation">
          <v-text-field v-model="name" label="Name" required />
          <v-btn type="submit">
            Add
          </v-btn>
        </form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>

export default {
  data() {
    return {
      name: "name"
    };
  },
  methods: {
    createLocation() {
      // eslint-disable-next-line
      const { name } = this;
      const location = { name };
      this.$store.dispatch('createLocation', location);
    }
  }
};
</script>
