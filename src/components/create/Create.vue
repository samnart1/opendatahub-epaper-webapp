<template>
  <div>
    <CreateDisplay/>
    <CreateLocation/>
    <CreateConnection/>
    <CreateTemplate/>
  </div>
</template>

<script>
import CreateDisplay from './CreateDisplay.vue'
import CreateLocation from './CreateLocation.vue'
import CreateTemplate from './CreateTemplate.vue'
import CreateConnection from './CreateConnection.vue'

export default {
  name: 'app',
  components: {
    CreateDisplay,
    CreateLocation,
    CreateConnection,
    CreateTemplate,
  }
}
</script>