<template>
  <b-card :title="pageTitle">
    <b-card-text>
      <b-form @submit.prevent="submitSchedule">
        <b-form-input
          v-model="eventDescription"
          label="Description"
          placeholder="Enter a description"
        />
        <div class="d-flex h-auto">
          <b-form-datepicker
            v-model="startDate"
            :value-as-date="true"
          ></b-form-datepicker>
          <b-form-input v-model="startTime" type="time" />
        </div>
        <div class="d-flex h-auto">
          <b-form-datepicker
            v-model="endDate"
            :value-as-date="true"
          ></b-form-datepicker>
          <b-form-input v-model="endTime" placeholder="HH" type="time" />
        </div>
        <b-button variant="danger" @click="$emit('completed')">
          Cancel
        </b-button>
        <b-button variant="success" type="submit"> Save </b-button>
      </b-form>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  props: {
    editMode: Boolean,
    initialStartDate: {
      type: Date,
      default: () => new Date(),
    },
    initialEndDate: {
      type: Date,
      default: () => new Date(),
    },
    initialDescription: {
      type: String,
      default: "",
    },
    eventId: Number,
    displayUuid: String,
    uuid: String,
  },
  data() {
    return {
      startDate: new Date(this.initialStartDate.getTime()),
      startTime: this.initialStartDate.toTimeString().substring(0, 5),
      endDate: new Date(this.initialEndDate.getTime()),
      endTime: this.initialEndDate.toTimeString().substring(0, 5),
      eventDescription: this.initialDescription,
    };
  },
  computed: {
    pageTitle() {
      return this.editMode ? "Edit scheduled event" : "Add scheduled event";
    },
  },
  methods: {
    submitSchedule() {
      const {
        startDate,
        endDate,
        eventDescription,
        eventId,
        displayUuid,
        uuid,
      } = this;
      const data = {
        startDate,
        endDate,
        eventDescription,
        eventId,
        displayUuid,
        uuid,
      };

      data.startDate.setHours(parseInt(this.startTime.substring(0, 2)));
      data.startDate.setMinutes(parseInt(this.startTime.substring(3, 5)));

      data.endDate.setHours(parseInt(this.endTime.substring(0, 2)));
      data.endDate.setMinutes(parseInt(this.endTime.substring(3, 5)));

      let storeOperation;
      if (this.editMode) {
        storeOperation = "updateDisplaySchedule";
      } else {
        storeOperation = "createDisplaySchedule";
      }

      this.$store
        .dispatch(storeOperation, data)
        .then(() => this.$emit("completed"));
    },
  },
};
</script>
