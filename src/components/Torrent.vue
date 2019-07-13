<template>
  <div id="torrent">
    <h1>Torrent</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Torrent",
  computed: {
    name() {
      return this.getFilmInfo.name;
    },

    year() {
      return this.getFilmInfo.year;
    },

    ...mapGetters(["getFilmInfo"])
  }
};
</script>
