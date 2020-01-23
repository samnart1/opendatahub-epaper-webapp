<template>
  <div class="create">
    <v-card width="400px">
      <v-card-title>
        Update Connection
      </v-card-title>
      <v-card-text>
        <b-form-select v-model="connectionUpdated">
          <option :value="null">Select Connection</option>
          <option
            v-for="connection in connections"
            :key="connection.uuid"
            :value="connection"
            >{{ connection.name }}</option
          >
        </b-form-select>
        <form @submit.prevent="updateConnection">
          <v-text-field
            v-if="connectionUpdated"
            v-model="connectionUpdated.name"
            label="Name"
            required
            >{{ connectionUpdated.name }}</v-text-field
          >

          <v-text-field
            v-if="connectionUpdated"
            v-model="connectionUpdated.longitude"
            label="Longitude"
            required
            >{{ connectionUpdated.longitude }}</v-text-field
          >
           <v-text-field
            v-if="connectionUpdated"
            v-model="connectionUpdated.latitude"
            label="Latitude"
            required
            >{{ connectionUpdated.latitude }}</v-text-field
          >

          <v-text-field
            v-if="connectionUpdated"
            v-model="connectionUpdated.networkAddress"
            label="Net Adreess"
            required
            >{{ connectionUpdated.networkAddress }}</v-text-field
          >

          <!-- <v-text-field
            v-if="connectionUpdated"
            v-model="connectionUpdated.protocol"
            label="Protocol"
            required
            >{{ connectionUpdated.protocol }}</v-text-field
          > -->

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
