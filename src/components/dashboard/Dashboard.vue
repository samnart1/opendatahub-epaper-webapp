<template>
  <div>
    <b-table striped hover :items="displays" :fields="fields">
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button>
      </template>

      <template v-slot:cell(template)="row">
        <b-col>
          {{ getTemplateName(row.item.image) }}
        </b-col>
      </template>

      <template v-slot:cell(location)="row">
        <b-col>
          {{ getLocationName(row.item.uuid) }}
        </b-col>
      </template>

      <template v-slot:row-details="row">
        <b-container>
          <b-row>
            <b-col>
              <b-row>
                <b-col>
                  {{ getConnectionIp(row.item.uuid) }}
                </b-col>

                <b-col>
                  {{ row.item.resolution.width }} x
                  {{ row.item.resolution.height }}
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-row>
                    <b-form-checkbox v-model="inverted"
                      >Inverted</b-form-checkbox
                    >
                    <b-button
                      variant="success"
                      size="sm"
                      @click="sendToDisplay(row.item.uuid)"
                      >Send Image</b-button
                    >
                    <b-button @click="clearDisplay(row.item.uuid)"
                      >Clear</b-button
                    >
                    <b-button @click="getCurrentState(row.item.uuid)"
                      >State</b-button
                    >
                    <b-button @click="deleteDisplay(row.item)" variant="danger"
                      >Delete</b-button
                    >
                  </b-row>
                </b-col>
              </b-row>
            </b-col>

            <b-col>
              <b-img
              :class="{invertedImage : inverted}"
                :width="row.item.resolution.width"
                :height="row.item.resolution.height"
                :src="'data:image/jpeg;base64,' + row.item.image"
              />
            </b-col>
          </b-row>
        </b-container>
      </template>
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
      inverted: false,
      fields: [
        { key: "name", sortable: true },
        { key: "location", sortable: true },
        { key: "template", sortable: true },
        { key: "batteryPercentage", sortable: true },
        { key: "show_details", sortable: false }
      ]
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
    },

    getConnectionIp(uuid) {
      var connection = this.$store.state.connections.filter(
        c => c.displayUuid === uuid
      );
      if (connection[0]) return connection[0].networkAddress;
      else return "No IP";
    },

    getLocationName(uuid) {
      var connection = this.$store.state.connections.filter(
        c => c.displayUuid === uuid
      );
      if (connection[0] && connection[0].location)
        return connection[0].location.name;
      else return "No Location";
    },
    getTemplateName(image) {
      var template = this.$store.state.templates.filter(c => c.image === image);
      if (template[0]) return template[0].name;
      else return "No Image";
    }
  }
};
</script>

<style scoped>
.invertedImage {
  filter: invert(100%);
}
</style>
