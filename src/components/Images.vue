<template>
  <div id="images" v-show="getFilmPictures.length">
    <h3>صور من الفيلم</h3>
    <div class="image" v-for="(pic, index) in getFilmPictures" :key="index">
      <img :src="pic" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "images",
  computed: {
    ...mapGetters(["getFilmPictures"])
  }
};
</script>
