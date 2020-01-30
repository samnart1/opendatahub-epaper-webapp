<template>
  <div>
    <UpdateDisplay/>
    <UpdateLocation/>
    <UpdateConnection/>
    <UpdateTemplate/>
  </div>
</template>

<script>
import UpdateDisplay from './UpdateDisplay.vue'
import UpdateLocation from './UpdateLocation.vue'
import UpdateTemplate from './UpdateTemplate.vue'
import UpdateConnection from './UpdateConnection.vue'

export default {
  name: 'app',
  components: {
    UpdateDisplay,
    UpdateLocation,
    UpdateConnection,
    UpdateTemplate,
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
