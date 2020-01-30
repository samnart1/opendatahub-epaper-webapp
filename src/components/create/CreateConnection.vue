<template>
  <div class="create">
    <v-card width="400px">
      <v-card-title>
        Create Connection
      </v-card-title>
      <v-card-text>
        <form @submit.prevent="createConnection">
          <v-text-field v-model="name" label="Name" required />
          <b-form-select v-model="displayUuid">
            <option :value="null">Select display</option>
            <option
              v-for="display in displays"
              :key="display.uuid"
              :value="display.uuid"
              >{{ display.name }}</option
            >
          </b-form-select>
          <b-form-select v-model="locationUuid">
            <option :value="null">Select location</option>
            <option
              v-for="location in locations"
              :key="location.uuid"
              :value="location.uuid"
              >{{ location.name }}</option
            >
          </b-form-select>
          <v-text-field v-model="longitude" label="Longitude" required />
          <v-text-field v-model="latitude" label="Latitude" required />
          <!-- <v-text-field v-model="protocol" label="Protocol" required /> -->
          <v-text-field
            v-model="networkAddress"
            label="Network Address"
            required
          />
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
      longitude: "",
      latitude : "",
      displayUuid: "",
      locationUuid: "",
      networkAddress: "192.168.13",
      // protocol: "WLAN"
    };
  },
  computed: {
    displays() {
      return this.$store.state.displays;
    },
    locations() {
      return this.$store.state.locations;
    }
  },
  methods: {
    createConnection() {
      // eslint-disable-next-line
      const {
        name,
        longitude,
        latitude,
        displayUuid,
        locationUuid,
        networkAddress,
        // protocol
      } = this;
      
      const connection = {
        name,
        longitude,
        latitude,
        displayUuid,
        locationUuid,
        networkAddress,
        // protocol
      };
      this.$store.dispatch("createConnection", connection);
    }
  }
};
</script>
