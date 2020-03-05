<template>
  <div class="create">
    <b-card width="400px" title="Add Location">
      <b-card-text>
        <b-form @submit.prevent="createLocation">
          <b-form-input v-model="name" label="Name" placeholder="Enter a name"/>
        
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
      name: null
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
