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
      primary-key="uuid"
    >
      <template v-slot:cell(name)="row">
        <b-col>
          {{ row.item.name }}
        </b-col>
      </template>

      <template v-slot:cell(room)="row">
        <b-col>
          {{ row.item.room }}
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
      ],
    };
  },
  computed: {
    locations() {
      let locations = this.$store.state.locations;
      locations.forEach((l) => {
        l.room = this.$store.state.rooms.find(
          (r) => r.code === l.roomCode
        )?.name;
      });
      return locations;
    },
  },
  methods: {
    editLocation(location) {
      if (location) {
        let formProps = {
          editMode: true,
          locationId: location.uuid,
          initialName: location.name,
          initialDescription: location.description,
          initialRoomCode: location.roomCode,
        };
        this.$router.push({ name: "Location Form", params: formProps });
      }
    },
    deleteLocation(location) {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to delete this location (${location.name}) ?`
        )
        .then((okPressed) => {
          if (okPressed) this.$store.dispatch("deleteLocation", location);
        });
    },
  },
};
</script>