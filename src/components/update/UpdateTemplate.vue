<template>
  <div class="create">
    <v-card width="400px">
      <v-card-title>
        Update Template
      </v-card-title>
      <v-card-text>
        <b-form-select v-model="templateUpdated">
          <option :value="null">Select Template</option>
          <option
            v-for="template in templates"
            :key="template.uuid"
            :value="template"
            >{{ template.name }}</option
          >
        </b-form-select>
        <form @submit.prevent="updateTemplate">
          <v-text-field
            v-if="templateUpdated"
            v-model="templateUpdated.name"
            label="Name"
            required
            >{{ templateUpdated.name }}</v-text-field
          >
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
      templateUpdated: null
    }
  },
  computed: {
    templates() {
      return JSON.parse(JSON.stringify(this.$store.state.templates))
    }
  },
  methods: {
    updateTemplate() {
      this.$store.dispatch("updateTemplate", this.templateUpdated)
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
