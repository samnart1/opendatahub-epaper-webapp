<template>
  <div>
    <b-row>
      <CreateDisplay />
      <CreateTemplate />
      <CreateConnection />
    </b-row>
  </div>
</template>

<script>
import CreateDisplay from "./CreateDisplay.vue";
import CreateTemplate from "./CreateTemplate.vue";
import CreateConnection from "./CreateConnection.vue";

export default {
  name: "app",
  components: {
    CreateDisplay,
    CreateConnection,
    CreateTemplate
  }
};
</script>
