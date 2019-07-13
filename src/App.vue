<template>
  <div id="app">
    <h1>geTorrent</h1>

    <Search />
    <Torrent />
    <Subtitle />
  </div>
</template>

<script>
import Search from "@/components/Search.vue";
import Torrent from "@/components/Torrent.vue";
import Subtitle from "@/components/Subtitle.vue";

export default {
  name: "app",
  components: {
    Search,
    Torrent,
    Subtitle
  }
};
</script>
