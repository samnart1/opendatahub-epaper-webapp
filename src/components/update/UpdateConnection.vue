<template>
  <b-card title="Edit Connection">
    <b-card-text>
      <b-form-select v-model="connectionUpdated">
        <option :value="null">Select Connection</option>
        <option
          v-for="connection in connections"
          :key="connection.uuid"
          :value="connection"
          >{{ getLocationName(connection) }} - {{ getDisplayName(connection) }}</option
        >
      </b-form-select>
      <b-form @submit.prevent="updateConnection">
        <b-form-input
          v-if="connectionUpdated"
          v-model="connectionUpdated.longitude"
        />
        <b-form-input
          v-if="connectionUpdated"
          v-model="connectionUpdated.latitude"
        />

        <b-form-input
          v-if="connectionUpdated"
          v-model="connectionUpdated.networkAddress"
        />

        <b-form-select
          v-if="connectionUpdated"
          v-model="connectionUpdated.displayUuid"
        >
          <option
            v-for="display in displays"
            :key="display.uuid"
            :value="display.uuid"
            :selected="display.uuid === connectionUpdated.displayUuid"
            >{{ display.name }}</option
          >
        </b-form-select>
        <b-form-select
          v-if="connectionUpdated"
          v-model="connectionUpdated.locationUuid"
        >
          <option
            v-for="location in locations"
            :key="location.uuid"
            :value="location.uuid"
            :selected="location.uuid === connectionUpdated.locationUuid"
            >{{ location.name }}</option
          >
        </b-form-select>
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
      connectionUpdated: null
    };
  },
  computed: {
    connections() {
      return JSON.parse(JSON.stringify(this.$store.state.connections));
    },
    displays() {
      return JSON.parse(JSON.stringify(this.$store.state.displays));
    },
    locations() {
      return JSON.parse(JSON.stringify(this.$store.state.locations));
    }
  },
  methods: {
    updateConnection() {
      this.$store.dispatch("updateConnection", this.connectionUpdated);
    },

    getDisplayName(connection){
      return this.displays.filter(display => display.uuid == connection.displayUuid)[0].name;
    },

    getLocationName(connection){
      return this.locations.filter(location => location.uuid == connection.locationUuid)[0].name;
    }
  }
};
</script>
