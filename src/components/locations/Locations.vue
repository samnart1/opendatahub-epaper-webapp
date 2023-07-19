<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

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
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:cell(name)="row">
        <b-col>
          {{ row.item.name }}
        </b-col>
      </template>

      <template v-slot:cell(rooms)="row">
        <b-col>
          {{ row.item.rooms }}
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
        { key: "rooms", sortable: true },
        { key: "description", sortable: true },
        { key: "options", sortable: false },
      ],
      sortBy: "name",
      sortDesc: false,
    };
  },
  computed: {
    locations() {
      let locations = this.$store.state.locations;
      // eslint-disable-next-line no-console
      // console.log(locations);
      locations.forEach((l) => {
        l.rooms = [];
        for (let code of l.roomCodes) {
          let roomName = this.$store.state.rooms.find(
            (r) => code == r.code
          )?.name;
          l.rooms.push(roomName);
        }
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