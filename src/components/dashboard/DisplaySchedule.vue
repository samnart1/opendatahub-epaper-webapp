<template> 
  <div>
    <b-button variant="success" to="" class="mb-2">
      Plan new content
    </b-button>
    <b-table
      striped
      hover
      head-variant="dark"
      :items="scheduledContent"
      :fields="schedulerFields"
    >
      <template v-slot:cell(eventDescription)="row">
        <b-col>
          {{ row.item.eventDescription }}
        </b-col>
      </template>

      <template v-slot:cell(startDate)="row">
        <b-col>
          {{ row.item.startDate }}
        </b-col>
      </template>

      <template v-slot:cell(endDate)="row">
        <b-col>
          {{ row.item.endDate }}
        </b-col>
      </template>
      <template v-slot:cell(options)="row">
        <b-button
          squared
          variant="info"
          @click="row.toggleDetails"
          class="mr-2"
        >
          {{ row.detailsShowing ? "Hide" : "Show" }} Content
        </b-button>
        <b-button
          squared
          variant="warning"
          @click="editEvent(row.item)"
          class="mr-2"
        >
          Edit
        </b-button>
        <b-button
          squared
          variant="danger"
          @click="deleteEvent(row.item)"
          class="mr-2"
        >
          Disable
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      schedulerFields: [
        { key: "eventDescription", sortable: true },
        { key: "startDate", sortable: true },
        { key: "endDate", sortable: true },
        { key: "options", sortable: false }
      ]
    };
  },
  props: ["scheduledContent"]
}
</script>

<style scoped>

</style>