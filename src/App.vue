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
