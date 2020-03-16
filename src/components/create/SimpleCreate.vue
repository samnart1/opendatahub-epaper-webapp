<template>
  <b-card>
    <b-card-text>
      <b-form @submit.prevent="createDisplay">
        <b-row class="row top-buffer">
          <b-col
            ><div
              @click="templateUuid = templates[0].uuid"
              :class="{ selected: templateUuid === templates[0].uuid , notselected: templateUuid != templates[0].uuid  }"

               class="un-seelcted"
            >
              <b-img
                :width="640 / 2"
                :height="384 / 2"
                :src="'data:image/jpeg;base64,' + templates[0].image"
              />
            </div>
          </b-col>
          <b-col>
            <div
              @click="templateUuid = templates[1].uuid"
              :class="{ selected: templateUuid === templates[1].uuid , notselected: templateUuid != templates[1].uuid  }"
            >
              <b-img
                :width="640 / 2"
                :height="384 / 2"
                :src="'data:image/jpeg;base64,' + templates[1].image"
              />
            </div>
          </b-col>
          <b-col
            ><div
              @click="templateUuid = templates[2].uuid"
              :class="{ selected: templateUuid === templates[2].uuid , notselected: templateUuid != templates[2].uuid  }"
            >
              <b-img
                :width="640 / 2"
                :height="384 / 2"
                :src="'data:image/jpeg;base64,' + templates[2].image"
              /></div
          ></b-col>
        </b-row>
        <b-row class="row top-buffer">
          <b-col>
            <b-form-input
              v-model="name"
              label="Name"
              placeholder="Enter a name"
            />
          </b-col>
          <b-col>
            <b-form-input
              v-model="networkAddress"
              label="IP"
              placeholder="Enter IP Address"
            />
          </b-col>
          <b-col>
            <b-form-select v-model="locationUuid">
              <b-form-select-option :value="null" disabled
                >Location</b-form-select-option
              >
              <option
                v-for="location in locations"
                :key="location.uuid"
                :value="location.uuid"
                >{{ location.name }}</option
              >
            </b-form-select>
          </b-col>
        </b-row>

        <b-row class="row top-buffer"
          ><b-col>
            <b-button variant="success" type="submit">
              Add
            </b-button></b-col
          >
        </b-row>
      </b-form>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      name: null,
      templateUuid: null,
      width: 640,
      height: 384,
      locationUuid: null,
      networkAddress: null
    };
  },
  computed: {
    templates() {
      return this.$store.state.templates;
    },
    locations() {
      return this.$store.state.locations;
    }
  },
  methods: {
    createDisplay() {
      const {
        name,
        templateUuid,
        width,
        height,
        locationUuid,
        networkAddress
      } = this;

      const connectionDto = {
        
      };
      const data = { name, templateUuid, width, height, connectionDto , locationUuid, networkAddress};

      this.$store.dispatch("simpleCreateDisplay", data);
    }
  }
};
</script>

<style>
.selected {
    border-style: solid;
    border-color: lightgreen;
    border-width: 3px;
    border-radius: 15px;
}

.notselected {
 border-style: solid;
    border-color: black;
    border-width: 3px;
    border-radius: 15px;
}

.top-buffer { margin-top:20px; }
</style>
