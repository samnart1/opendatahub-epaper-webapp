<template>
  <div class="create">
    <v-card width="400px">
      <v-card-title>
        Update Display
      </v-card-title>
      <v-card-text>
        <b-form-select v-model="displayUpdated">
          <option :value="null">Select Display</option>
          <option
            v-for="display in displays"
            :key="display.uuid"
            :value="display"
            >{{ display.name }}</option
          >
        </b-form-select>
        <form @submit.prevent="updateDisplay">
          <v-text-field
            v-if="displayUpdated"
            v-model="displayUpdated.name"
            label="Name"
            required
            >{{ displayUpdated.name }}</v-text-field
          >
          <b-form-select v-if="displayUpdated" v-model="templateUuid">
            <option :value="null">Select Template</option>
            <option
              v-for="template in templates"
              :key="template.uuid"
              :value="template.uuid"
              >{{ template.name }}</option
            >
          </b-form-select>
          <v-btn type="submit">
            Update
          </v-btn>
        </form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayUpdated : null,
      templateUuid: ""
    }
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
