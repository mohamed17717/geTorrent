<template>
  <div id="search">
    <input type="text" v-model="film.name" />
    <input type="number" v-model="film.year" min="1940" max="2019" />
    <button type="submit">search</button>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      film: {
        name: "",
        year: ""
      }
    };
  }
};
</script>
