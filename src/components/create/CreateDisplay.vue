<template>
    <b-card title="Add Display">
      <b-card-text>
        <b-form @submit.prevent="createDisplay">
          <b-form-input v-model="name" label="Name" placeholder="Enter a name"/>
          <b-form-input
            v-model="width"
            type="number"
            placeholder="Enter screen width"
          />
          <b-form-input
            v-model="height"
            type="number"
            placeholder="Enter screen height"
          />
          <b-form-select
            v-model="templateUuid"
            :options="templates"
            value-field="uuid"
            text-field="name"
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled
                >Select a template</b-form-select-option
              >
            </template>
          </b-form-select>

         <b-button variant="success" type="submit">
            Add
          </b-button>
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
      height: 384
    };
  },
  computed: {
    templates() {
      return this.$store.state.templates;
    }
  },
  methods: {
    createDisplay() {
      const { name, templateUuid, width, height } = this;
      const data = { name, templateUuid ,width, height};

      this.$store.dispatch("createDisplay", data);
    }
  }
};
</script>
