<template>
  <div>
    <DisplayScheduleForm
      v-if="showInsertForm"
      :editMode="false"
      @completed="showInsertForm = false"
      :displayUuid="displayUuid"
    ></DisplayScheduleForm>
    <b-button
      v-else
      variant="success"
      @click="showInsertForm = true"
      class="mb-2"
    >
      Plan new content
    </b-button>
    <b-table
      striped
      hover
      head-variant="dark"
      :items="scheduledContent"
      :fields="schedulerFields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      responsive="sm"
      primary-key="primaryKey"
    >
      <template v-slot:cell(eventDescription)="row">
        <b-col>
          {{ row.item.eventDescription }}
        </b-col>
      </template>

      <template v-slot:cell(startDate)="row">
        <b-col>
          {{
            `${row.item.startDate.toLocaleDateString()} ${row.item.startDate.toLocaleTimeString()}`
          }}
        </b-col>
      </template>

      <template v-slot:cell(endDate)="row">
        <b-col>
          {{
            `${row.item.endDate.toLocaleDateString()} ${row.item.endDate.toLocaleTimeString()}`
          }}
        </b-col>
      </template>
      <template v-slot:cell(options)="row">
        <b-button
          squared
          variant="info"
          @click="toggleDetails(row)"
          class="mr-2"
          :disabled="editPanelFlags[row.index]"
        >
          {{
            row.detailsShowing && !editPanelFlags[row.index] ? "Hide" : "Show"
          }}
          Details
        </b-button>
        <b-button
          squared
          variant="warning"
          @click="toggleEditPanel(row)"
          class="mr-2"
          :disabled="editPanelFlags[row.index]"
        >
          Edit
        </b-button>
        <b-button
          v-if="row.item.eventId"
          squared
          :variant="row.item.disabled ? 'success' : 'danger'"
          @click="disableEventClick(row.item)"
          class="mr-2"
          :disabled="editPanelFlags[row.index]"
        >
          {{ row.item.disabled ? "Enable" : "Disable" }}
        </b-button>
        <b-button
          v-else
          squared
          variant="danger"
          @click="deleteEventClick(row.item)"
          class="mr-2"
          :disabled="editPanelFlags[row.index]"
        >
          Delete
        </b-button>
      </template>
      <template v-slot:row-details="row">
        <DisplayScheduleForm
          v-if="editPanelFlags[row.index]"
          :initialDescription="row.item.eventDescription"
          :initialStartDate="row.item.startDate"
          :initialEndDate="row.item.endDate"
          :editMode="true"
          :eventId="row.item.eventId"
          :displayUuid="row.item.displayUuid"
          :uuid="row.item.uuid"
          @completed="onEditComplete(row)"
        ></DisplayScheduleForm>

        <div v-else>
          <p>
            {{
              `Original event description: ${row.item.originalEventDescription}`
            }}
          </p>
          <p>
            {{
              `Original event start date: ${row.item.originalStartDate.toLocaleDateString()} ${row.item.originalStartDate.toLocaleTimeString()}`
            }}
          </p>
          <p>
            {{
              `Original event end date: ${row.item.originalEndDate.toLocaleDateString()} ${row.item.originalEndDate.toLocaleTimeString()}`
            }}
          </p>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import Vue from "vue";
import DisplayScheduleForm from "./DisplayScheduleForm.vue";

export default {
  components: {
    DisplayScheduleForm,
  },
  data() {
    return {
      schedulerFields: [
        { key: "eventDescription", sortable: true },
        { key: "startDate", sortable: true },
        { key: "endDate", sortable: true },
        { key: "options", sortable: false },
      ],
      editPanelFlags: [],
      showInsertForm: false,
      sortBy: "startDate",
      sortDesc: false,
    };
  },
  props: ["displayUuid"],
  computed: {
    scheduledContent() {
      let displaySchedules =
        this.$store.state.displaySchedules[this.displayUuid];
      if (displaySchedules)
        displaySchedules = displaySchedules.map((item) => {
          item._rowVariant = item.disabled ? "danger" : "";
          item.startDate = new Date(item.startDate);
          item.endDate = new Date(item.endDate);
          item.originalStartDate = new Date(item.originalStartDate);
          item.originalEndDate = new Date(item.originalEndDate);
          item.primaryKey = item.uuid || item.eventId;
          return item;
        });
      return displaySchedules;
    },
  },
  mounted() {
    this.$store.dispatch("loadDisplaySchedule", this.displayUuid);
  },
  methods: {
    toggleDetails(row) {
      this.editPanelFlags[row.index] = false;
      row.toggleDetails();
    },
    toggleEditPanel(row) {
      //If the Standard detail panel is open, switch the flag only
      if (row.item._showDetails && !this.editPanelFlags[row.index]) {
        Vue.set(this.editPanelFlags, row.index, true);
      } else {
        row.toggleDetails();
        Vue.set(this.editPanelFlags, row.index, row.item._showDetails);
      }
    },
    onEditComplete(row) {
      Vue.set(this.editPanelFlags, row.index, false);
      row.toggleDetails();
    },
    disableEventClick(item) {
      this.$store.dispatch("updateDisplaySchedule", {
        ...item,
        disabled: !item.disabled,
      });
    },
    deleteEventClick(item) {
      this.$store.dispatch("deleteDisplaySchedule", item);
    },
  },
};
</script>