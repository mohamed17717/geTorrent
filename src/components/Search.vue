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
import { setTimeout } from "timers";

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
      this.updateUrl();
    },

    updateUrl() {
      let film = this.film;
      let host = location.origin + location.pathname;
      let newUrl = host + `?name=${film.name}&year=${film.year}`;
      history.pushState({}, null, newUrl);
    },

    ...mapMutations(["setFilmInfo", "setProgressBar"])
  },

  created() {
    let query = window.location.search.slice(1);
    if (query) {
      let params = {};
      query.split("&").map(item => {
        let [name, value] = item.split("=");
        params[decodeURI(name)] = decodeURI(value);
      });

      this.film.name = params.name;
      this.film.year = params.year;
      console.log(this.film);
      setTimeout(this.submitSearchForm, 1000);
    }
  }
};
</script>
