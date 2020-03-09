<template>
  <b-card title="Edit Template">
    <b-card-text>
      <b-form @submit.prevent="updateTemplate">
        <b-form-select v-model="templateUpdated">
          <option :value="null">Select Display</option>
          <option
            v-for="template in templates"
            :key="template.uuid"
            :value="template"
            >{{ template.name }}</option
          >
        </b-form-select>
        <b-form-input v-if="templateUpdated" v-model="templateUpdated.name" />

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

