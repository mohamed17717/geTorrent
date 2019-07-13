<template>
  <div id="subtitle">
    <h1>Subtitle</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Subtitle",
  computed: {
    name() {
      if (this.getFilmInfo.name) {
        return this.getFilmInfo.name;
      }
      return "";
    },

    year() {
      if (this.getFilmInfo.year) {
        return this.getFilmInfo.year;
      }
      return "";
    },

    ...mapGetters(["getFilmInfo"])
  }
};
</script>
