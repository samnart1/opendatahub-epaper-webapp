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
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
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

      <template v-slot:cell(last_state)="row">
        <b-col>
          {{
            row.item.lastState &&
            `${row.item.lastState.toLocaleDateString()} ${row.item.lastState.toLocaleTimeString()}`
          }}
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
        { key: "locationName", label: "Location", sortable: true },
        { key: "status", sortable: true },
        { key: "last_state", sortable: false }, // Cannot set "sortKey" for date sorting, need to update bootstrap-vue
        { key: "show_details", sortable: false },
      ],
      sortBy: "name",
      sortDesc: false,
    };
  },
  computed: {
    displays() {
      return this.$store.state.displays;
    },
    formatDisplayRows() {
      if (!this.displays) return [];
      return this.displays.map((item) => {
        item.location = this.getLocation(item.locationUuid);
        item.locationName = item.location ? item.location.name : "No location";
        item.lastState = item.lastState && new Date(item.lastState);
        if (
          !item.lastState ||
          Date.now() - item.lastState > this.NO_STATUS_THRESHOLD
        ) {
          item.status = "No status";
          item._rowVariant = "danger";
        } else if (item.errorMessage) {
          item.status = "Error";
          item._rowVariant = "danger";
        } else if (item.batteryPercentage <= 0) {
          item.status = "Dead battery";
          item._rowVariant = "danger";
        } else if (item.batteryPercentage <= this.LOW_BATTERY_THRESHOLD) {
          item.status = "Low battery";
          item._rowVariant = "warning";
        } else if (item.warningMessage) {
          item.status = "Warning";
          item._rowVariant = "warning";
        } else {
          item.status = "OK";
        }
        return item;
      });
    },
  },
  created() {
    this.LOW_BATTERY_THRESHOLD = 10;
    this.NO_STATUS_THRESHOLD = 10800000; //3 hours
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
    getLocation(uuid) {
      return this.$store.state.locations.find((l) => l.uuid === uuid);
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
.detailModal {
  text-align: center;
}
</style>
