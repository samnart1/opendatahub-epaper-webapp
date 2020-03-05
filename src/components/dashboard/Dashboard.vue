<template>
  <div>
    <b-table striped hover :items="displays" :fields="fields">
      <template v-slot:cell(show_details)="row">
        <b-button
          squared
          variant="info"
          @click="row.toggleDetails"
          class="mr-2"
        >
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
            <b-col >
              <b-row>
                <b-col> IP {{ getConnectionIp(row.item.uuid) }} </b-col>

                <b-col v-if="row.item.state"> MAC {{  row.item.state.macAddress }} </b-col>
              </b-row>
              <b-row>
                <b-col v-if="row.item.state"> Is Sleeping {{ row.item.state.isSleeping }} </b-col>

                <b-col v-if="row.item.state"> Has Image {{ row.item.state.hasImage }} </b-col>
              </b-row>
              <b-row>
                <b-col v-if="row.item.state"> Is Sleeping {{ row.item.state.isSleeping }} </b-col>

                <b-col>
                  Resolution {{ row.item.resolution.width }} x
                  {{ row.item.resolution.height }}
                </b-col>
              </b-row>
              <b-row v-if="row.item.state">
                Last State at {{ row.item.state.lastState | moment("dddd, MMMM Do YYYY, h:mm:ss a")  }} 
              </b-row>


              <b-row>
                <b-col>
                  <b-row>
                    <b-form-checkbox v-model="inverted" switch
                      >Invert</b-form-checkbox
                    >

                    <b-button
                      :disabled="$store.state.isLoading"
                      squared
                      variant="primary"
                      @click="sendToDisplay(row.item)"
                    >
                      <b-spinner
                        v-if="$store.state.isLoading"
                        small
                      ></b-spinner>
                      <span> Send</span></b-button
                    >
                    <b-button
                      squared
                      variant="primary"
                      :disabled="$store.state.isLoading"
                      @click="clearDisplay(row.item.uuid)"
                      >Clear</b-button
                    >
                    <b-button
                      squared
                      variant="primary"
                      :disabled="$store.state.isLoading"
                      @click="getCurrentState(row.item)"
                      >State</b-button
                    >
                    <b-button
                      squared
                      variant="danger"
                      :disabled="$store.state.isLoading"
                      @click="deleteDisplay(row.item)"
                      >Delete</b-button
                    >
                  </b-row>
                </b-col>
              </b-row>
            </b-col>

            <b-col>
              <b-img
                :class="{ invertedImage: inverted }"
                :width="row.item.resolution.width / 2"
                :height="row.item.resolution.height / 2"
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
      selectedDisplay: null,
      inverted : false,
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
      //setting the inverted field. Must be saved in API later on
      this.$store.state.displays.forEach(element => {
        element.inverted = false;
      });
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
    sendToDisplay(display) {
      const URL = this.$store.state.URI + "/display/send-to-e-ink-display";
      let params = new FormData();
      params.append("uuid", display.uuid);
      params.append("inverted", display.inverted);

      this.$store.state.isLoading = true;

      axios
        .post(URL, params)
        .then(response => {
          this.$store.state.isLoading = false;
          // eslint-disable-next-line
          console.log(response);
        })
        .catch(err => {
          this.$store.state.isLoading = false;
          // eslint-disable-next-line
          console.log(err);
        });
    },
    clearDisplay(uuid) {
      const URL =
        this.$store.state.URI + "/display/clear-e-ink-display/" + uuid;

      this.$store.state.isLoading = true;

      axios
        .post(URL)
        .then(response => {
          this.$store.state.isLoading = false;
          // eslint-disable-next-line
          console.log(response);
        })
        .catch(err => {
          this.$store.state.isLoading = false;
          // eslint-disable-next-line
          console.log(err);
        });
    },
    getCurrentState(display) {
      const URL =
        this.$store.state.URI + "/display/get-e-ink-display-state/" + display.uuid;

      this.$store.state.isLoading = true;

      display.state = {};

      axios
        .get(URL)
        .then(response => {
          display.state = response.data;
          this.$store.state.isLoading = false;
        })
        .catch(err => {
          this.$store.state.isLoading = false;
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
      else return "No Template";
    }
  }
};
</script>

<style scoped>
.invertedImage {
  filter: invert(100%);
}
</style>
