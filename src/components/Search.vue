<template>
  <div class="search search-container">
    <form v-on:submit.prevent="submitSearchForm">
      <input
        type="text"
        id="movie-name"
        name="movieName"
        placeholder="اسم الفيلم"
        autocomplete="off"
        required
        v-model="film.name"
      />

      <input
        type="number"
        id="movie-year"
        name="movieYear"
        min="1940"
        max="2019"
        placeholder="السنة"
        required
        v-model="film.year"
      />

      <button type="submit">
        <span>بحث</span><i class="fa fa-search"></i>
      </button>
      <div id="google-link"><a target="_blank"></a></div>
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
      this.setProgressBar(5);
    },

    ...mapMutations(["setFilmInfo", "setProgressBar"])
  }
};
</script>
