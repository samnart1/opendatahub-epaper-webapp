<template>
  <v-row justify="center">
    <v-expansion-panels popout>
      <v-expansion-panel v-for="(item, i) in displays" :key="i">
        <v-expansion-panel-header>{{ item.name }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-text>{{ item.batteryPercentage }} %</v-card-text>
            <v-img
              max-width="256px"
              max-height="144px"
              :aspect-ratio="16 / 9"
              v-bind:src="'data:image/jpeg;base64,' + item.image"
            />

            <v-checkbox v-model="inverted" label="inverted"></v-checkbox>
            <v-btn @click="sendToDisplay(item.uuid)">send</v-btn>
            <v-btn @click="clearDisplay(item.uuid)">clear</v-btn>
            <v-btn @click="getCurrentState(item.uuid)">state</v-btn>
            <v-btn @click="deleteDisplay(item)" variant="danger"
              >delete</v-btn
            >
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      state: null,
      selectedDisplay: null,
      inverted: false
    };
  },
  computed: {
    displays() {
      return this.$store.state.displays;
    },
    locations() {
      return this.$store.state.locations;
    },
    connections() {
      return this.$store.state.connections;
    },
    templates() {
      return this.$store.state.templates;
    }
  },
  methods: {
    deleteDisplay(display) {
      this.$store.dispatch("deleteDisplay", display);
    },
    deleteLocation(location) {
      this.$store.dispatch("deleteLocation", location);
    },
    deleteConnection(connection) {
      this.$store.dispatch("deleteConnection", connection);
    },
    deleteTemplate(template) {
      this.$store.dispatch("deleteTemplate", template);
    },
    sendToDisplay(uuid) {
      const URL = this.$store.state.URI + "/display/send-to-e-ink-display";
      let params = new FormData();
      params.append("uuid", uuid);
      params.append("inverted", this.inverted);

      axios
        .post(URL, params)
        .then()
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },
    clearDisplay(uuid) {
      const URL =
        this.$store.state.URI + "/display/clear-e-ink-display/" + uuid;
      axios
        .post(URL)
        .then()
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },
    getCurrentState(uuid) {
      const URL =
        this.$store.state.URI + "/display/get-e-ink-display-state/" + uuid;
      axios
        .get(URL)
        .then(response => (this.state = response.data))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
