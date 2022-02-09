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
          @click="openDisplayDetails(row.item)"
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
import DisplayInformation from "./DisplayInformation.vue";
import DisplaySchedule from "./DisplaySchedule.vue";
import DisplayContent from "./DisplayContent.vue";

export default {
  components: {
    DisplayInformation,
    DisplaySchedule,
    DisplayContent,
  },
  props: {
    // --- These props are used in QR code link ---
    displayId: String,
    screenWidth: Number,
    screenHeight: Number,
    screenBitDepth: Number,
    // ---
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
  created() {
    this.LOW_BATTERY_THRESHOLD = 5;
  },
  mounted() {
    //Check if we received display id via props
    if (this.displayId) {
      let display = this.displays.find((d) => d.uuid === this.displayId);
      if (display) {
        // Activate detail modal
        this.openDisplayDetails(display);
      } else {
        // No display found, go to display insert form
        let display = {
          uuid: this.displayId,
        };
        display.resolution = this.$store.state.resolutions.find(
          (r) =>
            r.width === this.screenWidth &&
            r.height === this.screenHeight &&
            r.bitDepth === this.screenBitDepth
        );
        let formProps = {
          display,
        };
        this.$router.replace({ name: "Display Form", params: formProps });
      }
    }
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
    openDisplayDetails(display) {
      this.selectedDisplay = display;
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
