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
            :value="row.item.fieldType"
            :options="fieldTypes"
            @input="onFieldTypeChange($event, row)"
          >
          </b-form-select>
        </b-col>
      </template>
      <template v-slot:cell(text)="row">
        <b-col>
          <b-form-input
            type="text"
            :value="row.item.customText"
            :disabled="row.item.fieldType != 'CUSTOM_TEXT'"
            @input="handleInput($event, row.index, 'customText')"
          ></b-form-input>
        </b-col>
      </template>
      <template v-slot:cell(fontSize)="row">
        <b-col>
          <b-form-input
            :value="row.item.fontSize"
            @input="handleInput($event, row.index, 'fontSize')"
            type="number"
          ></b-form-input>
        </b-col>
      </template>
      <template v-slot:cell(xPos)="row">
        <b-col>
          <b-form-input
            :value="row.item.xPos"
            @input="handleInput($event, row.index, 'xPos')"
            type="number"
          ></b-form-input>
        </b-col>
      </template>
      <template v-slot:cell(yPos)="row">
        <b-col>
          <b-form-input
            :value="row.item.yPos"
            @input="handleInput($event, row.index, 'yPos')"
            type="number"
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
    copyImageFields() {
      return this.imageFields.map((f) => {
        return { ...f };
      });
    },
    onFieldTypeChange(value, row) {
      const fields = this.copyImageFields();
      if (value === "CUSTOM_TEXT") {
        fields[row.index].customText = "";
      } else {
        fields[row.index].customText = `<${value}>`;
      }
      fields[row.index].fieldType = value;
      this.$emit("input", fields);
    },
    rowDeleteClick(row) {
      const fields = this.copyImageFields();
      fields.splice(row.index, 1);
      this.$emit("input", fields);
    },
    addNewField() {
      const fields = this.copyImageFields();
      fields.push({
        fieldType: "CUSTOM_TEXT",
        fontSize: 20,
        xPos: 50,
        yPos: 50,
        customText: "",
      });
      this.$emit("input", fields);
    },
    handleInput(value, index, column) {
      const fields = this.copyImageFields();
      fields[index][column] = value;
      this.$emit("input", fields);
    },
  },
};
</script>