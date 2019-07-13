<template>
  <div id="app">
    <Torrent />
    <Subtitle />
  </div>
</template>

<script>
import Torrent from "./components/Torrent.vue";
import Subtitle from "./components/Subtitle.vue";

export default {
  name: "app",
  components: {
    Torrent,
    Subtitle
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
