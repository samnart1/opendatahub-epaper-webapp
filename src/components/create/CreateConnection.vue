<template>
    <b-card title="Add Connection">
      <b-card-text>
        <b-form @submit.prevent="createConnection">
          <b-form-select
            v-model="displayUuid"
            :options="displays"
            value-field="uuid"
            text-field="name"
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled
                >Select a display</b-form-select-option
              >
            </template>
          </b-form-select>

          <b-form-select
            v-model="locationUuid"
            :options="locations"
            value-field="uuid"
            text-field="name"
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled
                >Select a location</b-form-select-option
              >
            </template>
          </b-form-select>

          <b-form-input
            v-model="networkAddress"
            placeholder="Enter the network address"
          />
          <b-form-input
            v-model="latitude"
            type="number"
            placeholder="Enter latitude"
          />
          <b-form-input
            v-model="longitude"
            type="number"
            label="Height"
            placeholder="Enter longitude"
          />

          <b-button variant="success" type="submit">
            Add
          </b-button>
        </b-form>
      </b-card-text>
    </b-card>
</template>

<script>
export default {
  data() {
    return {
      longitude: 0,
      latitude: 0,
      displayUuid: null,
      locationUuid: null,
      networkAddress: null
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
        longitude,
        latitude,
        displayUuid,
        locationUuid,
        networkAddress
        // protocol
      } = this;

      const connection = {
        longitude,
        latitude,
        displayUuid,
        locationUuid,
        networkAddress
        // protocol
      };
      this.$store.dispatch("createConnection", connection);
    }
  }
};
</script>
