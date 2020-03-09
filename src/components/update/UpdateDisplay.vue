<template>
  <b-card title="Edit Display">
    <b-card-text>
      <b-form @submit.prevent="updateDisplay">
        <b-form-select v-model="displayUpdated">
          <option :value="null">Select Display</option>
          <option
            v-for="display in displays"
            :key="display.uuid"
            :value="display"
            >{{ display.name }}</option
          >
        </b-form-select>

        <b-form-select v-if="displayUpdated" v-model="templateUuid">
          <option :value="null">Select Template</option>
          <option
            v-for="template in templates"
            :key="template.uuid"
            :value="template.uuid"
            >{{ template.name }}</option
          >
        </b-form-select>

        <b-form-input v-if="displayUpdated" v-model="displayUpdated.name" />
        <b-form-input  v-if="displayUpdated" 
          v-model="displayUpdated.resolution.width"
          type="number"
          placeholder="Enter screen width"
        />
        <b-form-input  v-if="displayUpdated" 
          v-model="displayUpdated.resolution.height"
          type="number"
          placeholder="Enter screen height"
        />

        <b-button variant="success" type="submit">
          Edit
        </b-button>
      </b-form>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      displayUpdated: null,
      templateUuid: null
    };
  },
  computed: {
    displays() {
      return JSON.parse(JSON.stringify(this.$store.state.displays));
    },
    templates() {
      return this.$store.state.templates;
    }
  },
  methods: {
    updateDisplay() {
      const { templateUuid, displayUpdated } = this;
      const data = { templateUuid, displayUpdated };
      this.$store.dispatch("updateDisplay", data);
    }
  }
};
</script>

<style scoped>
.create {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
