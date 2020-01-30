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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.create {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px
}

</style>
