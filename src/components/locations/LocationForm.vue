<template>
    <b-card :title="pageTitle">
      <b-card-text>
        <b-form @submit.prevent="submitLocation">
          <b-form-input v-model="name" label="Name" placeholder="Enter a name"/>
          <b-form-input v-model="description" label="Description" placeholder="Enter a description"/>
          <b-form-select v-model="roomCode" :options="rooms"></b-form-select>
          <b-button variant="success" type="submit">
            Save
          </b-button>
        </b-form>
      </b-card-text>
    </b-card>
</template>

<script>

export default {
  props: {
    editMode: Boolean,
    locationId: String,
    initialName: String,
    initialDescription: String,
    initialRoomCode: String
  },
  data() {
    return {
      name: this.initialName,
      description: this.initialDescription,
      roomCode: this.initialRoomCode
    };
  },
  computed: {
    rooms() {
      return this.$store.state.rooms.map(room => {
        return {
          text: room.name,
          value: room.code
        }
      });
    },
    pageTitle() {
      return this.editMode ? 'Edit location' : 'Add location';
    }
  },
  methods: {
    submitLocation() {
      const { name, roomCode, description } = this;
      const data = { name, roomCode, description };

      let storeOperation;
      if (this.editMode) {
        storeOperation = 'updateLocation';
        data.uuid = this.locationId;
      } else {
        storeOperation = 'createLocation';
      }

      this.$store.dispatch(storeOperation, data).then(() => this.$router.replace('locations'));
    }
  }
};
</script>
