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
      return this.getFilmInfo.name;
    },

    year() {
      return this.getFilmInfo.year;
    },

    ...mapGetters(["getFilmInfo"])
  }
};
</script>
