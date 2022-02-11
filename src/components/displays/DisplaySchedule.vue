<template>
  <div>
    <DisplayScheduleForm
      v-if="showAddForm"
      :editMode="false"
      :displayUuid="displayUuid"
      @completed="showAddForm = false"
    ></DisplayScheduleForm>
    <DisplayScheduleForm
      v-else-if="rowToEdit"
      :initialDescription="rowToEdit.eventDescription"
      :initialStartDate="rowToEdit.startDate"
      :initialEndDate="rowToEdit.endDate"
      :initialImageFields="
        rowToEdit.displayContent && rowToEdit.displayContent.imageFields
      "
      :editMode="true"
      :eventId="rowToEdit.eventId"
      :displayUuid="displayUuid"
      :uuid="rowToEdit.uuid"
      @completed="onEditFormComplete()"
    ></DisplayScheduleForm>
    <div v-else>
      <b-button variant="success" @click="showAddForm = true" class="mb-2">
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
            @click="row.toggleDetails"
            class="mr-2"
          >
            {{ row.detailsShowing ? "Hide" : "Show" }}
            Details
          </b-button>
          <b-button
            squared
            variant="warning"
            @click="toggleEditForm(row.item)"
            class="mr-2"
          >
            Edit
          </b-button>
          <b-button
            v-if="row.item.eventId"
            squared
            :variant="row.item.disabled ? 'success' : 'danger'"
            @click="disableEventClick(row.item)"
            class="mr-2"
          >
            {{ row.item.disabled ? "Enable" : "Disable" }}
          </b-button>
          <b-button
            v-else
            squared
            variant="danger"
            @click="deleteEventClick(row.item)"
            class="mr-2"
          >
            Delete
          </b-button>
        </template>
        <template v-slot:row-details="row">
          <p v-if="row.item.originalEventDescription">
            {{
              `Original event description: ${row.item.originalEventDescription}`
            }}
          </p>
          <p v-if="row.item.originalStartDate">
            {{
              `Original event start date: ${row.item.originalStartDate.toLocaleDateString()} ${row.item.originalStartDate.toLocaleTimeString()}`
            }}
          </p>
          <p v-if="row.item.originalEndDate">
            {{
              `Original event end date: ${row.item.originalEndDate.toLocaleDateString()} ${row.item.originalEndDate.toLocaleTimeString()}`
            }}
          </p>
          <b-img
            :src="`${apiUrl}/ScheduledContent/get-image/${
              row.item.uuid
            }?withTextFields=true&x=${Date.now()}`"
            fluid
            alt="No preview, edit the event and include an image"
          ></b-img>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
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
      showAddForm: false,
      sortBy: "startDate",
      sortDesc: false,
      rowToEdit: null,
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
          if (item.eventId) {
            item.originalStartDate = new Date(item.originalStartDate);
            item.originalEndDate = new Date(item.originalEndDate);
          }
          item.primaryKey = item.uuid || item.eventId;
          return item;
        });
      return displaySchedules;
    },
    apiUrl() {
      return this.$store.state.URI;
    },
  },
  mounted() {
    this.$store.dispatch("loadDisplaySchedule", this.displayUuid);
  },
  methods: {
    onEditFormComplete() {
      this.rowToEdit = null;
    },
    toggleEditForm(item) {
      this.rowToEdit = item;
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