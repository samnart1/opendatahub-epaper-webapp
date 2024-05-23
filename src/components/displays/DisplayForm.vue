<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <b-container>
    <b-form @submit.prevent="submitDisplay">
      <!-- name, id -->
      <b-form-group
        id="details"
        label="General information"
        label-for="details"
      >
        <b-form-input v-model="name" label="Name" placeholder="Enter a name" />
        <b-form-input
          v-model="uuid"
          label="ID"
          placeholder="Enter a display ID"
          :disabled="editMode"
        />
      </b-form-group>

      <!-- resolution -->
      <b-form-select
        v-model="resolutionUuid"
        :disabled="editMode"
        :options="resolutions"
      >
        <template v-slot:first>
          <b-form-select-option :value="null" disabled
            >Select resolution...</b-form-select-option
          >
        </template>
      </b-form-select>

      <!-- rooms -->
      <b-row>
        <b-col cols="6">
          <b-form-group
            id="rooms"
            label="Select rooms that wil show up on this display."
            label-for="rooms"
          >
            <b-form-input
              v-model="roomSearch"
              label="RoomSearch"
              placeholder="Search for room"
            />

            <div class="scroll-container">
              <b-list-group>
                <b-list-group-item
                  class="d-flex align-items-left"
                  v-for="item in getFilteredRooms()"
                  :key="item.id"
                >
                  <b-button
                    variant="info"
                    :disabled="selectedRooms.length == 6"
                    @click="selectRoom(item)"
                  >
                    {{ item.name }}</b-button
                  >
                </b-list-group-item>

                <b-list-group-item v-if="getFilteredRooms().length == 0">
                  No room found for "{{ roomSearch }}".
                </b-list-group-item>
              </b-list-group>
            </div>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group
            id="selected-rooms"
            label="Selected rooms"
            label-for="selected-rooms"
          >
            <div class="scroll-container">
              <b-list-group>
                <b-list-group-item v-if="selectedRooms.length == 0">
                  No room selected yet.
                </b-list-group-item>
                <b-list-group-item
                  class="d-flex justify-content-between align-items-center"
                  v-for="(item, index) in selectedRooms"
                  :key="item.id"
                >
                  <b-button variant="info" @click="removeRoom(item)">
                    #{{ index + 1 }} - {{ item.name }}
                  </b-button>
                  <span>
                    <b-button
                      variant="info"
                      :disabled="selectedRooms.indexOf(item) == 0"
                      @click="moveRoomUp(item)"
                    >
                      /\
                    </b-button>

                    <b-button
                      variant="info"
                      :disabled="
                        selectedRooms.indexOf(item) == selectedRooms.length - 1
                      "
                      @click="moveRoomDown(item)"
                    >
                      \/
                    </b-button>
                  </span>
                </b-list-group-item>
              </b-list-group>
            </div>
          </b-form-group>
        </b-col>
      </b-row>

      <b-button variant="success" type="submit"> Save </b-button>
    </b-form>
  </b-container>
</template>

<script>
import toastPresets from "@/utils/toastPresets.js";

export default {
  props: {
    editMode: Boolean,
    display: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      selectedRooms: [],
      name: this.display.name,
      uuid: this.display.uuid,
      roomSearch: "",
      resolutionUuid: this.display.resolution
        ? this.display.resolution.uuid
        : null,
      locationUuid: this.display.locationUuid || null,
    };
  },
  computed: {
    rooms() {
      return this.$store.state.rooms;
    },
    resolutions() {
      return this.$store.state.resolutions.map((r) => {
        return {
          value: r.uuid,
          text: `${r.width} x ${r.height} (${r.bitDepth} bit)`,
        };
      });
    },
    pageTitle() {
      return this.editMode ? "Edit display" : "Add display";
    },
  },
  mounted() {
    // get rooms, but keep order of roomCodes from API
    if (this.display.roomCodes) {
      this.selectedRooms = this.display.roomCodes.map((code) =>
        this.rooms.find((r) => code == r.code)
      );
    }
  },
  methods: {
    submitDisplay() {
      const { name, uuid, selectedRooms, resolutionUuid, display } = this;

      let roomCodes = selectedRooms.map((room) => room.code);

      const data = {
        ...display,
        name,
        uuid,
        roomCodes,
        resolution: this.$store.state.resolutions.find(
          (r) => r.uuid === resolutionUuid
        ),
      };

      let storeOperation;
      if (this.editMode) {
        storeOperation = "updateDisplay";
      } else {
        storeOperation = "createDisplay";
      }

      this.$store
        .dispatch(storeOperation, data)
        .then(() => this.$router.replace("displays"))
        .catch((err) => {
          this.$bvToast.toast(
            "Failed to save display " + err,
            toastPresets.errorMessage
          );
        });
    },

    getFilteredRooms() {
      return this.rooms.filter(
        (r) =>
          r.name.toLowerCase().includes(this.roomSearch.toLowerCase()) &&
          !this.selectedRooms.includes(r)
      );
    },

    selectRoom(room) {
      this.selectedRooms.push(room);
    },

    removeRoom(room) {
      this.selectedRooms.splice(this.selectedRooms.indexOf(room), 1);
    },

    moveRoomUp(room) {
      this.moveElement(
        this.selectedRooms,
        this.selectedRooms.indexOf(room),
        this.selectedRooms.indexOf(room) - 1
      );
    },

    moveRoomDown(room) {
      this.moveElement(
        this.selectedRooms,
        this.selectedRooms.indexOf(room),
        this.selectedRooms.indexOf(room) + 1
      );
    },
    moveElement(array, fromIndex, toIndex) {
      const element = array.splice(fromIndex, 1)[0];
      array.splice(toIndex, 0, element);
      return array;
    },
  },
};
</script>

<style scoped>
.scroll-container {
  height: 400px;
  overflow-y: auto;
}
</style>