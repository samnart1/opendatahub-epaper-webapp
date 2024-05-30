<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <b-form @submit.prevent="submitSchedule">
    <div class="editor">
      <b-card :title="pageTitle" class="form_card">
        <b-card-text>
          <b-form-input
            v-model="eventDescription"
            label="Description"
            placeholder="Enter a description"
            class="mb-3"
          />
          <b-form-group label="From date and time:" class="form_group">
            <div class="d-flex h-auto">
              <b-form-datepicker
                v-model="startDate"
                :value-as-date="true"
              ></b-form-datepicker>
              <b-form-input v-model="startTime" type="time" />
            </div>
          </b-form-group>
          <b-form-group label="To date and time:" class="form_group">
            <div class="d-flex h-auto">
              <b-form-datepicker
                v-model="endDate"
                :value-as-date="true"
              ></b-form-datepicker>
              <b-form-input v-model="endTime" placeholder="HH" type="time" />
            </div>
          </b-form-group>
        </b-card-text>
        <b-form-group label="Choose a picture:" class="form_group">
          <b-form-file v-model="image" accept="image/*"></b-form-file>
        </b-form-group>
        <b-form-group
          label="Or choose a template:"
          class="form_group"
          description="Choosing a different template will override existing picture and fields"
        >
          <b-form-select
            v-model="selectedTemplateId"
            value-field="uuid"
            text-field="name"
            :options="templates"
            @input="onSelectedTemplateChange"
          >
          </b-form-select>
        </b-form-group>
        <b-card>
          <b-card-text>
            <ImageFields v-model="imageFields"></ImageFields>
          </b-card-text>
        </b-card>
      </b-card>
      Image preview
      <ImagePreview
        class="image_preview"
        :imageSrc="imageSrc"
        :imageFields="imageFields"
        :padding="padding"
      ></ImagePreview>
    </div>
    <div class="mb-3 mt-2">
      <b-button variant="danger" class="mr-2" @click="$emit('completed')">
        Cancel
      </b-button>
      <b-button variant="success" type="submit"> Save </b-button>
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
    initialStartDate: {
      type: Date,
      default: () => new Date(),
    },
    initialEndDate: {
      type: Date,
      default: () => new Date(),
    },
    initialDescription: {
      type: String,
      default: "",
    },
    eventId: Number,
    displayUuid: String,
    uuid: String,
    initialImageFields: Array,
    initialPadding: Number,
  },
  components: {
    ImageFields,
    ImagePreview,
  },
  data() {
    return {
      startDate: new Date(this.initialStartDate.getTime()),
      startTime: this.initialStartDate.toTimeString().substring(0, 5),
      endDate: new Date(this.initialEndDate.getTime()),
      endTime: this.initialEndDate.toTimeString().substring(0, 5),
      eventDescription: this.initialDescription,
      selectedTemplateId: null,
      image: null,
      imageFields: this.initialImageFields || [],
      padding: this.initialImageFields || 0,
    };
  },
  computed: {
    pageTitle() {
      return this.editMode ? "Edit scheduled content" : "Add scheduled content";
    },
    imageSrc() {
      if (this.image) {
        return this.image;
      } else if (this.selectedTemplateId) {
        return `${this.$store.state.URI}/template/get-image/${
          this.selectedTemplateId
        }?x=${Date.now()}`;
      } else if (this.uuid) {
        return `${this.$store.state.URI}/ScheduledContent/get-image/${
          this.uuid
        }?x=${Date.now()}`;
      }
      return null;
    },
    templates() {
      return this.$store.state.templates;
    },
  },
  methods: {
    submitSchedule() {
      const {
        startDate,
        endDate,
        eventDescription,
        eventId,
        displayUuid,
        uuid,
        imageFields,
        image,
        padding,
        selectedTemplateId,
      } = this;
      const data = {
        startDate,
        endDate,
        eventDescription,
        eventId,
        displayUuid,
        uuid,
      };
      const content = {
        image,
        scheduledContentUuid: uuid,
        displayContent: {
          imageFields,
          padding : Number(padding),
        },
        templateUuid: selectedTemplateId,
      };

      data.startDate.setHours(parseInt(this.startTime.substring(0, 2)));
      data.startDate.setMinutes(parseInt(this.startTime.substring(3, 5)));

      data.endDate.setHours(parseInt(this.endTime.substring(0, 2)));
      data.endDate.setMinutes(parseInt(this.endTime.substring(3, 5)));

      let storeOperation;
      if (this.editMode) {
        storeOperation = "updateDisplaySchedule";
      } else {
        storeOperation = "createDisplaySchedule";
      }

      this.$store
        .dispatch(storeOperation, data)
        .then((sc) => {
          if (sc) {
            content.scheduledContentUuid = sc.uuid;
          }
          return this.$store.dispatch("updateScheduledContent", content);
        })
        .then(() => this.$emit("completed"))
        .catch(() => {
          this.$bvToast.toast(
            "Failed to save scheduled content",
            toastPresets.errorMessage
          );
        });
    },
    onSelectedTemplateChange(value) {
      this.image = null;
      let template = this.templates.find((t) => t.uuid === value);
      this.imageFields =
        template.displayContent &&
        template.displayContent.imageFields.map((f) => {
          return { ...f };
        });
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
.form_group {
  text-align: left;
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