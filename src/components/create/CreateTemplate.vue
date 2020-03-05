<template>
  <div class="create">
    <b-card width="400px" title="Add Template">
      <b-card-text>
        <b-form @submit.prevent="createTemplate">
          <b-form-input v-model="name" label="Name" placeholder="Enter a name"/>
        <b-form-file v-model="image" accept="image/*"></b-form-file>
         <b-button variant="success" type="submit">
            Add
          </b-button>
        </b-form>
      </b-card-text>
       
    </b-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      name: null,
      image: null
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
