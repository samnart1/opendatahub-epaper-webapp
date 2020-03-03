<template>
  <div>
    <v-layout row>
      <v-flex lg3 offset-lg-1>
        <v-card>
          <v-toolbar color="light-blue" light extended>
            <v-toolbar-side-icon></v-toolbar-side-icon>

            <v-toolbar-title>Displays</v-toolbar-title>

            <v-spacer></v-spacer>

            <!-- <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>view_module</v-icon>
          </v-btn> -->
          </v-toolbar>

          <v-list-tile
            v-model="selectedDisplay"
            v-for="item in displays"
            :key="item.uuid"
          >
            <v-list-tile-content @click="selectedDisplay = item">
              <v-card>
                <v-card-title>{{ item.name }}</v-card-title>
                <v-card-text>{{ item.uuid }}</v-card-text>
              </v-card>
            </v-list-tile-content>
          </v-list-tile>
        </v-card>
      </v-flex>

      <v-flex lg6 offset-lg-1>
        <v-card v-if="selectedDisplay">
          <v-img
            :src="'data:image/jpeg;base64,' + selectedDisplay.image"
          ></v-img>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      state: null,
      selectedDisplay: null
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
      const URL =
        this.$store.state.URI + "/display/send-to-e-ink-display/" + uuid;
      axios
        .post(URL)
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
