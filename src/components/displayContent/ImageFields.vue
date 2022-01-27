<template>
  <div>
    <b-table
      striped
      small
      head-variant="dark"
      :items="imageFields"
      :fields="tableColumns"
    >
      <template v-slot:cell(fieldType)="row">
        <b-col>
          <b-form-select
            v-model="row.item.fieldType"
            :options="fieldTypes"
            @input="onFieldTypeChange(row)"
          >
          </b-form-select>
        </b-col>
      </template>
      <template v-slot:cell(text)="row">
        <b-col>
          <b-form-input
            type="text"
            v-model="row.item.customText"
            :disabled="row.item.fieldType != 'CUSTOM_TEXT'"
            @input="handleInput"
          ></b-form-input>
        </b-col>
      </template>
      <template v-slot:cell(fontSize)="row">
        <b-col>
          <b-form-input
            v-model="row.item.fontSize"
            @input="handleInput"
          ></b-form-input>
        </b-col>
      </template>
      <template v-slot:cell(xPos)="row">
        <b-col>
          <b-form-input
            v-model="row.item.xPos"
            @input="handleInput"
          ></b-form-input>
        </b-col>
      </template>
      <template v-slot:cell(yPos)="row">
        <b-col>
          <b-form-input
            v-model="row.item.yPos"
            @input="handleInput"
          ></b-form-input>
        </b-col>
      </template>
      <template v-slot:cell(options)="row">
        <b-button variant="danger" @click="rowDeleteClick(row)" class="mr-2">
          Delete
        </b-button>
      </template>
    </b-table>
    <b-button variant="success" @click="addNewField()">
      Add new field
    </b-button>
  </div>
</template>

<script>
const fieldTypes = [
  { value: "CUSTOM_TEXT", text: "Custom text" },
  { value: "LOCATION_NAME", text: "Location name" },
  { value: "EVENT_DESCRIPTION", text: "Event description" },
  { value: "EVENT_START_DATE", text: "Event start date" },
  { value: "EVENT_END_DATE", text: "Event end date" },
  { value: "UPCOMING_EVENT_DESCRIPTION", text: "Upcoming event description" },
  { value: "UPCOMING_EVENT_START_DATE", text: "Upcoming event start date" },
  { value: "UPCOMING_EVENT_END_DATE", text: "Upcoming event end date" },
];

export default {
  props: ["imageFields"], //For v-model
  model: {
    prop: "imageFields",
  },
  data() {
    return {
      tableColumns: [
        { key: "fieldType", sortable: false },
        { key: "text", sortable: false },
        { key: "fontSize", sortable: false },
        { key: "xPos", sortable: false },
        { key: "yPos", sortable: false },
        { key: "options", sortable: false },
      ],
    };
  },
  created() {
    this.fieldTypes = fieldTypes;
  },
  methods: {
    onFieldTypeChange(row) {
      if (row.item.fieldType === "CUSTOM_TEXT") {
        row.item.customText = "";
      } else {
        row.item.customText = `<${row.item.fieldType}>`;
      }
      this.$emit("input", this.imageFields);
    },
    rowDeleteClick(row) {
      this.imageFields.splice(row.index, 1);
      this.$emit("input", this.imageFields);
    },
    addNewField() {
      if (!this.imageFields) {
        this.imageFields = [];
      }
      this.imageFields.push({
        fieldType: "CUSTOM_TEXT",
        fontSize: 20,
        xPos: 50,
        yPos: 50,
        customText: "",
      });
      this.$emit("input", this.imageFields);
    },
    handleInput() {
      this.$emit("input", this.imageFields);
    },
  },
};
</script>