<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <b-button variant="success" @click="addNewField()"> Add field </b-button>
    <div class="container">
      <b-table
        striped
        small
        head-variant="dark"
        :items="imageFields"
        :fields="tableColumns"
        selectable
        select-mode="single"
        no-select-on-click
        ref="fieldTable"
      >
        <template v-slot:cell(fieldType)="row">
          <b-form-select
            :value="row.item.fieldType"
            :options="fieldTypes"
            @input="onFieldTypeChange($event, row)"
            @click="selectRow(row.index)"
          ></b-form-select>
        </template>
        <template v-slot:cell(content)="row">
          <b-form-textarea
            type="text"
            :value="row.item.customText"
            :disabled="row.item.fieldType != 'CUSTOM_TEXT'"
            @input="handleInput($event, row.index, 'customText')"
            @click="selectRow(row.index)"
          ></b-form-textarea>
        </template>
        <template v-slot:cell(fontSize)="row">
          <b-form-input
            :value="row.item.fontSize"
            @input="handleInput($event, row.index, 'fontSize')"
            type="number"
            @click="selectRow(row.index)"
          ></b-form-input>
        </template>
        <template v-slot:cell(xPos)="row">
          <b-form-input
            :value="row.item.xPos"
            @input="handleInput($event, row.index, 'xPos')"
            type="number"
            @click="selectRow(row.index)"
          ></b-form-input>
        </template>
        <template v-slot:cell(yPos)="row">
          <b-form-input
            :value="row.item.yPos"
            @input="handleInput($event, row.index, 'yPos')"
            type="number"
            @click="selectRow(row.index)"
          ></b-form-input>
        </template>
        <template v-slot:cell(width)="row">
          <b-form-input
            :value="row.item.width"
            @input="handleInput($event, row.index, 'width')"
            type="number"
            @click="selectRow(row.index)"
          ></b-form-input>
        </template>
        <template v-slot:cell(height)="row">
          <b-form-input
            :value="row.item.height"
            @input="handleInput($event, row.index, 'height')"
            type="number"
            @click="selectRow(row.index)"
          ></b-form-input>
        </template>
        <template v-slot:cell(fixed)="row">
          <b-form-checkbox
            :checked="row.item.fixed"
            @change="handleInput($event, row.index, 'fixed')"
            @input="selectRow(row.index)"
          ></b-form-checkbox>
        </template>
        <template v-slot:cell(remove)="row">
          <b-button variant="danger" @click="rowDeleteClick(row)" class="mr-2">
            X
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
const fieldTypes = [
  { value: "CUSTOM_TEXT", text: "Custom text" },
  { value: "LOCATION_NAME", text: "Location name" },
  { value: "EVENT_DESCRIPTION", text: "Event description" },
  { value: "EVENT_START_DATE", text: "Event start date" },
  { value: "EVENT_END_DATE", text: "Event end date" },
  { value: "EVENT_ORGANIZER", text: "Event organizer" },
  { value: "UPCOMING_EVENT_DESCRIPTION", text: "Upcoming event description" },
  { value: "UPCOMING_EVENT_START_DATE", text: "Upcoming event start date" },
  { value: "UPCOMING_EVENT_END_DATE", text: "Upcoming event end date" },
  { value: "UPCOMING_EVENT_ORGANIZER", text: "Upcoming event organizer" },
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
        { key: "content", sortable: false },
        { key: "fontSize", sortable: false },
        { key: "xPos", sortable: false },
        { key: "yPos", sortable: false },
        { key: "width", sortable: false },
        { key: "height", sortable: false },
        { key: "fixed", sortable: false },
        { key: "remove", sortable: false },
      ],
      selectedRow: 0,
    };
  },
  created() {
    this.fieldTypes = fieldTypes;
  },
  mounted() {
    this.selectRow(this.selectedRow);
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
        fontSize: 42,
        xPos: 50,
        yPos: 100,
        width: 800,
        height: 52,
        fixed: false,
        customText: "CUSTOM_TEXT",
      });
      this.$emit("input", fields);
    },
    handleInput(value, index, column) {
      const fields = this.copyImageFields();
      fields[index][column] = value;
      this.$emit("input", fields);
    },
    selectRow(index) {
      if (!this.$refs.fieldTable.isRowSelected(index)) {
        this.$refs.fieldTable.selectRow(index);
        this.selectedRow = index;
        this.$emit("selectedRowChange", index);
      }
    },
  },
  updated() {
    this.selectRow(this.selectedRow);
  },
};
</script>

<style scoped>
.container {
  height: 45vh;
  overflow: scroll;
  margin-top: 2vh;
}
</style>