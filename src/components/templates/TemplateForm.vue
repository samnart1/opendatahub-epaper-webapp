<template>
  <b-form @submit.prevent="submitTemplate">
    <div class="editor">
      <b-card :title="pageTitle" class="form_card">
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
          <b-form-file v-model="image" accept="image/*"></b-form-file>
          <b-card>
            <b-card-text>
              <ImageFields
                v-model="imageFields"
                @selectedRowChange="onSelectedRowChange"
              ></ImageFields>
            </b-card-text>
          </b-card>
        </b-card-text>
      </b-card>
      Template image preview
      <ImagePreview
        class="image_preview"
        :imageSrc="imageSrc"
        :imageFields="imageFields"
        :focusedFieldIndex="focusedFieldIndex"
      ></ImagePreview>
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
import ImageFields from "@/components/displayContent/ImageFields.vue";
import ImagePreview from "@/components/displayContent/ImagePreview.vue";

export default {
  props: {
    editMode: Boolean,
    initialName: String,
    initialDescription: String,
    initialImageFields: Array,
    templateId: String,
  },
  components: {
    ImageFields,
    ImagePreview,
  },
  data() {
    return {
      name: this.initialName,
      description: this.initialDescription,
      image: null,
      imageFields: this.initialImageFields || [],
      focusedFieldIndex: null
    };
  },
  computed: {
    pageTitle() {
      return this.editMode ? "Edit template" : "Add template";
    },
    imageSrc() {
      return this.editMode && !this.image
        ? `${this.$store.state.URI}/template/get-image/${
            this.templateId
          }?x=${Date.now()}`
        : this.image;
    },
  },

  methods: {
    submitTemplate() {
      const { name, description, imageFields, image, templateId } = this;
      const templateContent = {
        image,
        displayContent: {
          imageFields,
        },
        templateUuid: templateId,
      };
      const template = {
        name,
        description,
      };

      let storeOperation;
      if (this.editMode) {
        storeOperation = "updateTemplate";
        template.uuid = templateId;
      } else {
        storeOperation = "createTemplate";
      }

      this.$store
        .dispatch(storeOperation, template)
        .then((template) => {
          if (template) {
            templateContent.templateUuid = template.uuid;
          }
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
    }
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
.image_preview {
  width: 38%;
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