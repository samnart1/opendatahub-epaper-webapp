<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <b-form @submit.prevent="submitTemplate">
    <div class="editor">
      <b-card :title="pageTitle" class="form_card">
        <!-- general info name, description -->
        <b-card-text>
          <b-form-input
            v-model="name"
            label="Name"
            placeholder="Enter a name"
            required
          />
          <b-form-input
            v-model="description"
            label="Description"
            placeholder="Enter a description"
          />

          <b-input-group>
            <!-- resolution -->
            <b-form-select
              :disabled="editMode"
              v-model="resolution"
              :options="resolutions"
            >
            </b-form-select>

            <!-- max rooms -->
            <b-form-select v-model="maxRooms">
              <b-form-select-option selected :value="1"
                >1 rooms</b-form-select-option
              >
              <b-form-select-option :value="2">2 rooms</b-form-select-option>
              <b-form-select-option :value="3">3 rooms</b-form-select-option>
              <b-form-select-option :value="4">4 rooms</b-form-select-option>
              <b-form-select-option :value="5">5 rooms</b-form-select-option>
              <b-form-select-option :value="6">6 rooms</b-form-select-option>
            </b-form-select>
          </b-input-group>
          <!-- image -->
          <b-form-file v-model="image" accept="image/*"></b-form-file>
          <!-- header/footer -->
          <b-input-group>
            <label for="padding">Header/Footer size (aka padding)</label>
            <b-form-input
              id="padding"
              label=""
              v-model="padding"
              type="number"
              min="0"
            ></b-form-input>
          </b-input-group>
          <!-- content preview -->
          <b-card>
            <b-card-text>
              <ImageFields
                v-model="imageFields"
                @selectedRowChange="onSelectedRowChange"
              ></ImageFields>
            </b-card-text>
          </b-card>
        </b-card-text>
        <div>
          <b-button variant="danger" to="/templates" class="mt-2 mr-2">
            Cancel
          </b-button>
          <b-button variant="success" type="submit" class="mt-2">
            Save
          </b-button>
        </div>
      </b-card>
      <ImagePreview
        class="image_preview"
        :imageSrc="imageSrc"
        :imageFields="imageFields"
        :focusedFieldIndex="focusedFieldIndex"
        :width="resolution ? resolution.width : 1440"
        :height="resolution ? resolution.height : 2560"
        :maxRooms="maxRooms"
        :padding="padding"
      ></ImagePreview>
    </div>
  </b-form>
</template>

<script>
import toastPresets from "@/utils/toastPresets.js";
import ImageFields from "@/components/displayContent/ImageFields.vue";
import ImagePreview from "@/components/displayContent/ImagePreview.vue";

export default {
  props: {
    editMode: Boolean,
    template: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  components: {
    ImageFields,
    ImagePreview,
  },
  data() {
    return {
      name: this.template.name,
      description: this.template.description,
      image: null,
      padding: this.template.displayContent.padding || 0,
      maxRooms: this.template.maxRooms || 1,
      imageFields: this.template.displayContent
        ? this.template.displayContent.imageFields
        : [],
      focusedFieldIndex: null,
      resolution: this.template.resolution || null,
    };
  },
  computed: {
    pageTitle() {
      return this.editMode ? "Edit template" : "Add template";
    },
    imageSrc() {
      return this.editMode && !this.image
        ? `${this.$store.state.URI}/template/get-image/${
            this.template.uuid
          }?x=${Date.now()}`
        : this.image;
    },
    resolutions() {
      return this.$store.state.resolutions.map((r) => {
        return {
          value: r,
          text: `${r.width} x ${r.height} (${r.bitDepth} bit)`,
        };
      });
    },
  },
  mounted() {
    // set resolution to first, if not set yet
    if (this.resolution == null) {
      this.resolution = this.resolutions[0].value;
    }
  },

  methods: {
    submitTemplate() {
      const {
        name,
        padding,
        description,
        resolution,
        maxRooms,
        image,
        imageFields,
      } = this;
      const templateContent = {
        image,
        displayContent: {
          imageFields,
          padding: Number(padding),
        },
      };
      const newTemplate = {
        name,
        description,
        maxRooms,
        resolution,
      };

      let storeOperation;
      if (this.editMode) {
        storeOperation = "updateTemplate";
        newTemplate.uuid = this.template.uuid;
        templateContent.templateUuid = this.template.uuid;
      } else {
        storeOperation = "createTemplate";
      }

      this.$store
        .dispatch(storeOperation, newTemplate)
        .then((template) => {
          if (template) {
            templateContent.templateUuid = template.uuid;
          }
          console.log(templateContent);
          return this.$store.dispatch("updateTemplateContent", templateContent);
        })
        .then(() => this.$router.replace("templates"))
        .catch((err) => {
          this.$bvToast.toast(
            "Failed to save template " + err,
            toastPresets.errorMessage
          );
        });
    },
    onSelectedRowChange(index) {
      this.focusedFieldIndex = index;
    },
  },
};
</script>

<style scoped>
.editor {
  overflow: auto;
}
.form_card {
  width: 50%;
  float: left;
  margin-bottom: 5px;
}
.image_preview {
  width: 45%;
}

/* Responsive layout - makes a one column-layout instead of two-column layout */
@media (max-width: 1200px) {
  .form_card {
    width: 100%;
  }
  .image_preview {
    width: 100%;
  }
}
</style>