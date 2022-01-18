<template>
  <b-card :title="pageTitle">
    <b-card-text>
      <b-form @submit.prevent="submitTemplate">
        <b-form-input v-model="name" label="Name" placeholder="Enter a name" />
        <b-form-input
          v-model="description"
          label="Description"
          placeholder="Enter a description"
        />
        <b-form-file v-model="image" accept="image/*"></b-form-file>
        <b-table
          striped
          hover
          head-variant="dark"
          :items="imageFields"
          :fields="tableColumns"
        >
          <template v-slot:cell(fieldType)="row">
            <b-col>
              <b-form-select v-model="row.item.fieldType" :options="fieldTypes">
                <template v-slot:first>
                  <b-form-select-option :value="undefined" disabled
                    >Select field type...</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-col>
          </template>
          <template v-slot:cell(text)="row">
            <b-col>
              <b-form-input
                type="text"
                v-model="row.item.customText"
                :disabled="row.item.fieldType != 'CUSTOM_TEXT'"
              ></b-form-input>
            </b-col>
          </template>
          <template v-slot:cell(xPos)="row">
            <b-col>
              <b-form-input
                type="number"
                v-model="row.item.xPos"
              ></b-form-input>
            </b-col>
          </template>
          <template v-slot:cell(yPos)="row">
            <b-col>
              <b-form-input
                type="number"
                v-model="row.item.yPos"
              ></b-form-input>
            </b-col>
          </template>
          <template v-slot:cell(options)="row">
            <b-button
              variant="danger"
              @click="rowDeleteClick(row)"
              class="mr-2"
            >
              Delete
            </b-button>
          </template>
        </b-table>
        <div>
          <b-button variant="success" @click="addNewField()" class="mb-2">
            Add new field
          </b-button>
        </div>
        <div>
          <b-button variant="danger" to="/templates" class="mb-2 mr-2">
            Cancel
          </b-button>
          <b-button variant="success" type="submit" class="mb-2">
            Save
          </b-button>
        </div>
      </b-form>
    </b-card-text>
  </b-card>
</template>

<script>
const fieldTypes = [
  { value: "CUSTOM_TEXT", text: "Custom text" },
  { value: "LOCATION_NAME", text: "Location name" },
  { value: "EVENT_DESCRIPTION", text: "Event description" },
  { value: "EVENT_START_DATE", text: "Event start date" },
  { value: "EVENT_END_DATE", text: "Event end date" },
];

export default {
  props: {
    editMode: Boolean,
    initialName: String,
    initialDescription: String,
    initialImageFields: Array,
    templateId: String,
  },
  data() {
    return {
      name: this.initialName,
      description: this.initialDescription,
      image: null,
      tableColumns: [
        { key: "fieldType", sortable: false },
        { key: "text", sortable: false },
        { key: "xPos", sortable: false },
        { key: "yPos", sortable: false },
        { key: "options", sortable: false },
      ],
      imageFields: this.initialImageFields || [],
    };
  },
  computed: {
    rooms() {
      return this.$store.state.rooms;
    },
    pageTitle() {
      return this.editMode ? "Edit template" : "Add template";
    },
  },
  created() {
    this.fieldTypes = fieldTypes;
  },
  methods: {
    submitTemplate() {
      const { name, description, imageFields, image } = this;
      const data = {
        image,
        template: {
          name,
          description,
          displayContent: {
            imageFields,
          },
        },
      };

      let storeOperation;
      if (this.editMode) {
        storeOperation = "updateTemplate";
        data.template.uuid = this.templateId;
      } else {
        storeOperation = "createTemplate";
      }

      this.$store
        .dispatch(storeOperation, data)
        .then(() => this.$router.replace("templates"));
    },
    rowDeleteClick(row) {
      this.imageFields.splice(row.index, 1);
    },
    addNewField() {
      this.imageFields.push({});
    },
  },
};
</script>
