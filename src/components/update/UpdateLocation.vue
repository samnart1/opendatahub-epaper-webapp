<template>
  <b-card title="Edit Location">
    <b-card-text>
      <b-form @submit.prevent="updateLocation">
        <b-form-select v-model="locationUpdated">
          <option :value="null">Select Display</option>
          <option
            v-for="location in locations"
            :key="location.uuid"
            :value="location"
            >{{ location.name }}</option
          >
        </b-form-select>
        <b-form-input v-if="locationUpdated" v-model="locationUpdated.name" />

        <b-button variant="success" type="submit">
          Edit
        </b-button>
      </b-form>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      locationUpdated: null
    };
  },
  computed: {
    locations() {
      return JSON.parse(JSON.stringify(this.$store.state.locations));
    }
  },
  methods: {
    updateLocation() {
      this.$store.dispatch("updateLocation", this.locationUpdated);
    }
  }
};
</script>
