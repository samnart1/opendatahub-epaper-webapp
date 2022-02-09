<template>
  <b-card :title="pageTitle">
    <b-card-text>
      <b-form @submit.prevent="submitDisplay">
        <b-form-input v-model="uuid" label="ID" placeholder="Enter a display ID" :disabled="editMode" />
        <b-form-input v-model="name" label="Name" placeholder="Enter a name" />
        <b-form-select
          v-model="locationUuid"
          :options="locations"
          value-field="uuid"
          text-field="name"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled
              >Select location...</b-form-select-option
            >
          </template>
        </b-form-select>
        <b-form-select v-model="resolutionUuid" :options="resolutions">
          <template v-slot:first>
            <b-form-select-option :value="null" disabled
              >Select resolution...</b-form-select-option
            >
          </template>
        </b-form-select>

        <b-button variant="success" type="submit"> Save </b-button>
      </b-form>
    </b-card-text>
  </b-card>
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
      name: this.display.name,
      uuid: this.display.uuid,
      resolutionUuid: this.display.resolution
        ? this.display.resolution.uuid
        : null,
      locationUuid: this.display.locationUuid || null,
    };
  },
  computed: {
    locations() {
      return this.$store.state.locations;
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
  methods: {
    submitDisplay() {
      const { name, uuid, locationUuid, resolutionUuid, display } = this;

      const data = {
        ...display,
        name,
        uuid,
        locationUuid,
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
        .catch(() => {
          this.$bvToast.toast(
            "Failed to save display",
            toastPresets.errorMessage
          );
        });
    },
  },
};
</script>
