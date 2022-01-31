<template>
  <div>
    <b-button variant="success" to="/location-form" class="mb-2">
      Add location
    </b-button>
    <b-table
      striped
      hover
      head-variant="dark"
      :items="locations"
      :fields="fields"
    >
      <template v-slot:cell(name)="row">
        <b-col>
          {{ row.item.name }}
        </b-col>
      </template>

      <template v-slot:cell(room)="row">
        <b-col>
          {{ getRoomName(row.item.roomCode) }}
        </b-col>
      </template>

      <template v-slot:cell(description)="row">
        <b-col>
          {{ row.item.description }}
        </b-col>
      </template>
      <template v-slot:cell(options)="row">
        <b-button
          squared
          variant="info"
          @click="row.toggleDetails"
          class="mr-2"
        >
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button>
        <b-button
          squared
          variant="warning"
          @click="editLocation(row.item)"
          class="mr-2"
        >
          Edit
        </b-button>
        <b-button
          squared
          variant="danger"
          @click="deleteLocation(row.item)"
          class="mr-2"
        >
          Delete
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>

export default {
  data() {
    return {
      fields: [
        { key: "name", sortable: true },
        { key: "room", sortable: true },
        { key: "description", sortable: true },
        { key: "options", sortable: false },
      ]
    };
  },
  computed: {
    locations() {
      return this.$store.state.locations;
    },
    rooms() {
      return this.$store.state.rooms;
    }
  },
  methods: {
    getRoomName(code) {
      if (code && this.rooms)
        return this.rooms.find(r => r.code === code)?.name;
    },
    editLocation(location) {
      if (location) {
        let formProps = {
          editMode: true,
          locationId: location.uuid,
          initialName: location.name,
          initialDescription: location.description,
          initialRoomCode: location.roomCode
        };
        this.$router.push({ name: 'Location Form', params: formProps });
      }
    },
    deleteLocation(location) {
      this.$bvModal.msgBoxConfirm(`Are you sure you want to delete this location (${location.name}) ?`).then((okPressed) => {
        if (okPressed)
          this.$store.dispatch('deleteLocation', location);
      })
    }
  }
};
</script>