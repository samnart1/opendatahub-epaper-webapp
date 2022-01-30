<template>
  <div>
    <b-table
      striped
      hover
      head-variant="dark"
      :items="formatDisplayRows"
      :fields="fields"
    >
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

      <template v-slot:cell(location)="row">
        <b-col>
          {{ getLocationName(row.item.locationUuid) }}
        </b-col>
      </template>

      <template v-slot:row-details="row">
        <b-tabs content-class="mt-3">
          <b-tab lazy title="Information">
            <b-container>
              <b-row>
                <b-col>
                  <b-row>
                    <b-col> IP {{ getConnectionIp(row.item.uuid) }} </b-col>
                    <b-col> Battery: {{ row.item.batteryPercentage }}% </b-col>
                    <b-col v-if="row.item.errorMessage" class="errorMessage">
                      Error: {{ row.item.errorMessage }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col v-if="row.item.state">
                      <span v-if="!row.item.state.isSleeping">Is Sleeping</span>
                      <span v-if="row.item.state.isSleeping">Is Awake</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col v-if="row.item.state">
                      Resolution {{ row.item.resolution.width }} x
                      {{ row.item.resolution.height }}
                    </b-col>
                  </b-row>
                  <b-row v-if="row.item.state">
                    <b-col>
                      Last State at
                      {{
                        row.item.state.lastState
                          | moment("dddd, MMMM Do YYYY, h:mm:ss a")
                      }}
                    </b-col>
                  </b-row>

                  <b-row class="buttons">
                    <b-col>
                      <b-row>
                        <b-col>
                          <!--b-form-checkbox
                              :disabled="row.item.isLoading"
                              v-model="row.item.inverted"
                              switch
                              v-on:change="invert(row.item)"
                              >Invert</b-form-checkbox
                            -->
                        </b-col>
                        <b-col>
                          <b-button
                            :disabled="row.item.isLoading"
                            squared
                            variant="primary"
                            @click="sendToDisplay(row.item)"
                          >
                            <b-spinner
                              v-if="row.item.isLoading"
                              small
                            ></b-spinner>
                            <span> Send</span></b-button
                          >
                        </b-col>
                        <b-col>
                          <b-button
                            squared
                            variant="primary"
                            :disabled="row.item.isLoading"
                            @click="clearDisplay(row.item)"
                            >Clear</b-button
                          >
                        </b-col>
                        <b-col>
                          <b-button
                            squared
                            variant="primary"
                            :disabled="row.item.isLoading"
                            @click="getCurrentState(row.item)"
                            >State</b-button
                          >
                        </b-col>
                        <b-col>
                          <b-button
                            squared
                            variant="danger"
                            :disabled="row.item.isLoading"
                            @click="deleteDisplay(row.item)"
                            >Delete</b-button
                          >
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col>
                  <b-img
                    style="
                      border: 2px solid black;
                      border-radius: 5px;
                      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                        0 6px 20px 0 rgba(0, 0, 0, 0.19);
                    "
                    :class="{ invertedImage: row.item.inverted }"
                    :width="row.item.resolution.width / 2"
                    :height="row.item.resolution.height / 2"
                    :src="`${apiUrl}/display/get-image/${
                      row.item.uuid
                    }?withTextFields=true&x=${Date.now()}`"
                    fluid
                    alt="Cannot load preview"
                  />
                </b-col>
              </b-row>
            </b-container>
          </b-tab>
          <b-tab title="Content">
            <DisplayContent
              lazy
              :display-uuid="row.item.uuid"
              :initial-image-fields="
                row.item.displayContent && row.item.displayContent.imageFields
              "
              :ignore-schedule="row.item.ignoreScheduledContent"
              @onIgnoreScheduleChange="setIgnoreSchedule"
            ></DisplayContent>
          </b-tab>
          <b-tab title="Scheduler">
            <DisplaySchedule
              lazy
              :scheduled-content="row.item.scheduledContent"
              :display-uuid="row.item.uuid"
            />
          </b-tab>
        </b-tabs>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from "axios";
import DisplaySchedule from "./DisplaySchedule.vue";
import DisplayContent from "./DisplayContent.vue";

export default {
  components: {
    DisplaySchedule,
    DisplayContent,
  },
  data() {
    return {
      selectedDisplay: null,
      fields: [
        { key: "name", sortable: true },
        { key: "location", sortable: true },
        { key: "show_details", sortable: false },
      ],
    };
  },
  created() {
    this.LOW_BATTERY_THRESHOLD = 5;
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
    },
    formatDisplayRows() {
      if (!this.displays) return [];
      return this.displays.map((item) => {
        if (item.errorMessage) item._rowVariant = "danger";
        else if (item.batteryPercentage <= this.LOW_BATTERY_THRESHOLD)
          item._rowVariant = "warning";
        return item;
      });
    },
    apiUrl() {
      return this.$store.state.URI;
    },
  },
  methods: {
    invert(display) {
      this.$store.dispatch("invert", display);
    },
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
      const URL = this.$store.state.URI + "/display/send";
      let params = new FormData();
      params.append("uuid", display.uuid);
      params.append("inverted", display.inverted);

      this.$store.dispatch("isLoading", [display, true]);

      axios
        .post(URL, params)
        .then((response) => {
          this.$store.dispatch("isLoading", [display, false]);
          display.state = response.data;
          // eslint-disable-next-line
          console.log(response);
        })
        .catch((err) => {
          this.$store.dispatch("isLoading", [display, false]);
          display.state = err.data;
          // eslint-disable-next-line
          console.log(err);
        });
    },
    clearDisplay(display) {
      const URL = this.$store.state.URI + "/display/clear/" + display.uuid;

      this.$store.dispatch("isLoading", [display, true]);
      axios
        .post(URL)
        .then((response) => {
          display.state = response.data;
          this.$store.dispatch("isLoading", [display, false]);
          // eslint-disable-next-line
          console.log(response);
        })
        .catch((err) => {
          this.$store.dispatch("isLoading", [display, false]);
          display.state = err.data;
          // eslint-disable-next-line
          console.log(err);
        });
    },
    getCurrentState(display) {
      const URL = this.$store.state.URI + "/display/state/" + display.uuid;

      this.$store.dispatch("isLoading", [display, true]);

      axios
        .get(URL)
        .then((response) => {
          display.state = response.data;
          this.$store.dispatch("isLoading", [display, false]);
        })
        .catch((err) => {
          this.$store.dispatch("isLoading", [display, false]);
          display.state = err.data;
          // eslint-disable-next-line
          console.log(err);
        });
    },

    getConnectionIp(uuid) {
      var connection = this.$store.state.connections.filter(
        (c) => c.displayUuid === uuid
      );
      if (connection[0]) return connection[0].networkAddress;
      else return "No IP";
    },

    getConnectionMAC(uuid) {
      var connection = this.$store.state.connections.filter(
        (c) => c.displayUuid === uuid
      );
      if (connection[0]) return connection[0].mac;
      else return "No MAC";
    },

    isConnected(uuid) {
      var connection = this.$store.state.connections.filter(
        (c) => c.displayUuid === uuid
      );
      if (connection[0]) return connection[0].connected;
      else return false;
    },

    getLocationName(uuid) {
      let location = this.$store.state.locations.find((l) => l.uuid === uuid);
      if (location) return location.name;
      else return "No Location";
    },
    getTemplateName(image) {
      // console.log(row.item)
      var template = this.$store.state.templates.filter(
        (c) => c.image === image
      );
      if (template[0]) return template[0].name;
      else return "No Template";
    },
    setIgnoreSchedule(displayUuid, ignoreFlag) {
      let display = this.displays.find((d) => d.uuid === displayUuid);
      if (display) {
        display.ignoreScheduledContent = ignoreFlag;
        this.$store.dispatch("updateDisplay", display);
      }
    },
  },
};
</script>

<style scoped>
.invertedImage {
  filter: invert(100%);
}

.buttons {
  margin-top: 10%;
}

.errorMessage {
  color: red;
}
</style>
