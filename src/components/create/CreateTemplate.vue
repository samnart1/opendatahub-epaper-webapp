<template>
  <div class="create">
    <v-card width="400px">
      <v-card-title>
        Create Template
      </v-card-title>
      <v-card-text>
        <form @submit.prevent="createTemplate">
          <v-text-field v-model="name" label="Name" required />
          <b-form-file
            v-model="image"
            :state="Boolean(image)"
            accept="image/jpeg, image/png, image/bmp "
            placeholder="Choose a image or drop it here..."
            drop-placeholder="Drop image here..."
          ></b-form-file>
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
      name: "name",
      image: ""
    };
  },
  methods: {
    createTemplate() {
      const { name, image } = this;
      const data = { name, image };

      this.$store.dispatch("createTemplate", data);
    }
  }
};
</script>
