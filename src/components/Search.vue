<template>
  <div id="search">
    <form v-on:submit.prevent="submitSearchForm">
      <input type="text" v-model="film.name" />
      <input type="number" v-model="film.year" min="1940" max="2019" />
      <button type="submit">search</button>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      film: {
        name: "",
        year: ""
      }
    };
  },

  methods: {
    submitSearchForm() {
      this.setFilmInfo(this.film);
    },

    ...mapMutations(["setFilmInfo"])
  }
};
</script>
