<template>
  <div>
    <b-table striped hover :items="displays" :fields="[{key:'name', sortable : true},{key:'batteryPercentage', sortable : true}]">

    </b-table>
  </div>
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
