<template>
  <div>
    <h1>Displays</h1>
    <ul v-if="displays && displays.length">
      <li v-for="display in displays" :key="display.uuid">
        <b-card :title="display.name" style="max-width: 20rem;" class="mb-2">
          <b-card-text> battery: {{ display.batteryPercentage }} </b-card-text>
          <b-card-img v-bind:src="'data:image/jpeg;base64,' + display.image" />
          <b-button @click="sendToDisplay(display.uuid)">send</b-button>
          <b-button @click="clearDisplay(display.uuid)">clear</b-button>
          <b-button @click="deleteDisplay(display)" variant="danger"
            >delete</b-button
          >
        </b-card>
      </li>
    </ul>

    <h1>Locations</h1>
    <ul v-if="locations && locations.length">
      <li v-for="location in locations" :key="location.uuid">
        <b-card :title="location.name" style="max-width: 20rem;" class="mb-2">
          <b-button @click="deleteLocation(location)" variant="danger"
            >delete</b-button
          >
        </b-card>
      </li>
    </ul>

    <h1>Connections</h1>
    <ul v-if="connections && connections.length">
      <li v-for="connection in connections" :key="connection.uuid">
        <b-card :title="connection.name" style="max-width: 20rem;" class="mb-2">
          <b-card-text>
            display:
            {{
              displays.filter(
                display => display.uuid === connection.displayUuid
              )[0].name
            }}
          </b-card-text>

          <b-card-text>
            location:
            {{
              locations.filter(
                location => location.uuid === connection.locationUuid
              )[0].name
            }}
          </b-card-text>

          <b-card-text> address: {{ connection.networkAddress }} </b-card-text>
          <!-- <b-card-text> protocol: {{ connection.protocol }} </b-card-text> -->
          <b-card-text>longitude: {{ connection.longitude }} </b-card-text>
          <b-card-text>latitude: {{ connection.latitude }} </b-card-text>

          <b-button @click="deleteConnection(connection)" variant="danger"
            >delete</b-button
          >
        </b-card>
      </li>
    </ul>

    <h1>Templates</h1>
    <ul v-if="templates && templates.length">
      <li v-for="template in templates" :key="template.uuid">
        <b-card :title="template.name" style="max-width: 20rem;" class="mb-2">
          <b-card-img v-bind:src="'data:image/jpeg;base64,' + template.image" />
          <b-button @click="deleteTemplate(template)" variant="danger"
            >delete</b-button
          >
        </b-card>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
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
      const URL = this.$store.state.URI + "/display/send-to-e-ink-display/" + uuid;
      axios
        .post(URL)
        .then()
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },
    clearDisplay(uuid) {
      const URL = this.$store.state.URI + "/display/clear-e-ink-display/" + uuid;
      axios
        .post(URL)
        .then()
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
