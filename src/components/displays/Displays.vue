<template>
  <div>
    <b-button variant="success" to="/display-form" class="mb-2">
      Add display
    </b-button>
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
          @click="onDetailClick(row.item)"
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
    </b-table>
    <b-modal id="details-modal" hide-footer size="xl" title="Display details">
      <b-tabs content-class="mt-3" class="detailModal" v-if="selectedDisplay">
        <b-tab lazy title="Information">
          <DisplayInformation lazy :display="selectedDisplay" />
        </b-tab>
        <b-tab title="Content">
          <DisplayContent
            lazy
            :display-uuid="selectedDisplay.uuid"
            :initial-image-fields="
              selectedDisplay.displayContent &&
              selectedDisplay.displayContent.imageFields
            "
            :ignore-schedule="selectedDisplay.ignoreScheduledContent"
            @onIgnoreScheduleChange="setIgnoreSchedule"
          ></DisplayContent>
        </b-tab>
        <b-tab title="Scheduler">
          <DisplaySchedule
            lazy
            :scheduled-content="selectedDisplay.scheduledContent"
            :display-uuid="selectedDisplay.uuid"
          />
        </b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import DisplayInformation from "./DisplayInformation.vue";
import DisplaySchedule from "./DisplaySchedule.vue";
import DisplayContent from "./DisplayContent.vue";

export default {
  components: {
    DisplayInformation,
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
  },
  methods: {
    invert(display) {
      this.$store.dispatch("invert", display);
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
    onDetailClick(item) {
      this.selectedDisplay = item;
      this.$bvModal.show("details-modal");
    },
  },
};
</script>

<style scoped>
.invertedImage {
  filter: invert(100%);
}

.detailModal {
  text-align: center;
}
</style>
