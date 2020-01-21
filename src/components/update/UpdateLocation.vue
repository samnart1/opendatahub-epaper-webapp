<template>
  <div class="create">
    <v-card width="400px">
      <v-card-title>
        Update Location
      </v-card-title>
      <v-card-text>
        <b-form-select v-model="locationUpdated">
          <option :value="null">Select Location</option>
          <option
            v-for="location in locations"
            :key="location.uuid"
            :value="location"
            >{{ location.name }}</option
          >
        </b-form-select>
        <form @submit.prevent="updateLocation">
          <v-text-field
            v-if="locationUpdated"
            v-model="locationUpdated.name"
            label="Name"
            required
            >{{ locationUpdated.name }}</v-text-field
          >
          <v-btn type="submit">
            Update
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
      locationUpdated: null
    }
  },
  computed: {
    locations() {
      return JSON.parse(JSON.stringify(this.$store.state.locations))
    }
  },
  methods: {
    updateLocation() {
      this.$store.dispatch("updateLocation", this.locationUpdated)
    }
  }
};
</script>

<style scoped>
.create {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
