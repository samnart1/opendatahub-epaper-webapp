<template>
  <div class="create">
    <v-card width="400px">
      <v-card-title>
        Create Display
      </v-card-title>
      <v-card-text>
        <form @submit.prevent="createDisplay">
          <v-text-field v-model="name" label="Name" required />
          <b-form-select v-model="templateUuid">
            <option :value="null">Select Template</option>
            <option
              v-for="template in templates"
              :key="template.uuid"
              :value="template.uuid"
              >{{ template.name }}</option
            >
          </b-form-select>
          <v-btn type="submit">
            Add
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
      name: "name",
      templateUuid: ""
    };
  },
  computed: {
    templates() {
      return this.$store.state.templates
    }
  },
  methods: {
    createDisplay() {
      const { name, templateUuid } = this;
      const data = { name,  templateUuid };

      this.$store.dispatch("createDisplay", data);
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
