<template>
  <b-form @submit.prevent="submitTemplate">
    <div class="editor">
      <b-card :title="pageTitle" class="form_card">
        <b-card-text>
          <b-form-input
            v-model="name"
            label="Name"
            placeholder="Enter a name"
          />
          <b-form-input
            v-model="description"
            label="Description"
            placeholder="Enter a description"
          />
          <b-form-file
            v-model="image"
            @input="onPictureUpload"
            accept="image/*"
          ></b-form-file>
          <b-card>
            <b-card-text>
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
                      @input="refreshImageCanvas"
                    ></b-form-input>
                  </b-col>
                </template>
                <template v-slot:cell(fontSize)="row">
                  <b-col>
                    <b-form-input
                      v-model="row.item.fontSize"
                      @input="refreshImageCanvas"
                    ></b-form-input>
                  </b-col>
                </template>
                <template v-slot:cell(xPos)="row">
                  <b-col>
                    <b-form-input
                      v-model="row.item.xPos"
                      @input="refreshImageCanvas"
                    ></b-form-input>
                  </b-col>
                </template>
                <template v-slot:cell(yPos)="row">
                  <b-col>
                    <b-form-input
                      v-model="row.item.yPos"
                      @input="refreshImageCanvas"
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
              <b-button variant="success" @click="addNewField()">
                Add new field
              </b-button>
            </b-card-text>
          </b-card>
        </b-card-text>
      </b-card>
      Template image preview
      <canvas class="image_canvas" id="canvas" width="0" height="0"></canvas>
    </div>
    <div>
      <b-button variant="danger" to="/templates" class="mt-2 mr-2">
        Cancel
      </b-button>
      <b-button variant="success" type="submit" class="mt-2">
        Save template
      </b-button>
    </div>
  </b-form>
</template>

<script>
import toastPresets from "@/utils/toastPresets.js";

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
        { key: "fontSize", sortable: false },
        { key: "xPos", sortable: false },
        { key: "yPos", sortable: false },
        { key: "options", sortable: false },
      ],
      imageFields: this.initialImageFields || [],
    };
  },
  computed: {
    pageTitle() {
      return this.editMode ? "Edit template" : "Add template";
    },
    apiUrl() {
      return this.$store.state.URI;
    },
  },
  created() {
    this.fieldTypes = fieldTypes;
  },
  mounted() {
    this.previewImg = new Image();
    if (this.editMode) {
      this.previewImg.src = `${this.apiUrl}/template/getImage/${
        this.templateId
      }?x=${Date.now()}`;
    }
    this.previewImg.onload = () => {
      if (this.previewImg.src) {
        let canvas = document.getElementById("canvas");
        canvas.width = this.previewImg.width;
        canvas.height = this.previewImg.height;
        this.refreshImageCanvas();
      }
    };
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
        .then(() => this.$router.replace("templates"))
        .catch(() => {
          this.$bvToast.toast(
            "Failed to save template",
            toastPresets.errorMessage
          );
        });
    },
    rowDeleteClick(row) {
      this.imageFields.splice(row.index, 1);
      this.refreshImageCanvas();
    },
    addNewField() {
      this.imageFields.push({
        fieldType: "CUSTOM_TEXT",
        fontSize: 20,
        xPos: 50,
        yPos: 50,
        customText: "",
      });
      this.refreshImageCanvas();
    },
    refreshImageCanvas() {
      if (this.previewImg) {
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");

        context.drawImage(this.previewImg, 0, 0);
        context.lineWidth = 1;

        this.imageFields.forEach((f) => {
          context.font = `${f.fontSize}px sans-serif`;
          context.fillText(f.customText, f.xPos, f.yPos);
        });
      }
    },
    onPictureUpload() {
      var reader = new FileReader();

      reader.onloadend = () => {
        this.previewImg.src = reader.result;
      };

      if (this.image) {
        reader.readAsDataURL(this.image);
      } else {
        this.previewImg.src = "";
      }
    },
    onFieldTypeChange(row) {
      if (row.item.fieldType === "CUSTOM_TEXT") {
        row.item.customText = "";
      } else {
        row.item.customText = `<${row.item.fieldType}>`;
      }
    },
  },
};
</script>

<style scoped>
.editor {
  overflow: auto;
}
.form_card {
  width: 60%;
  float: left;
  margin-bottom: 5px;
}
.image_canvas {
  position: relative;
  width: 40%;
  filter: grayscale(100%);
}

/* Responsive layout - makes a one column-layout instead of two-column layout */
@media (max-width: 1200px) {
  .form_card {
    width: 100%;
  }
  .image_canvas {
    width: 100%;
  }
}
</style>