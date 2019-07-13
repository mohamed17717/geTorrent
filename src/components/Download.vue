<template>
  <div id="content" v-show="getFilmCover">
    <div class="header">
      <h2>فيلم {{ getFilmName }} عام ({{ getFilmYear }})</h2>
      <div class="hr"></div>
    </div>

    <div class="data">
      <div class="image">
        <img :src="getFilmCover" :alt="`${getFilmName} (${getFilmYear})`" />
      </div>

      <div class="download">
        <Torrent />
        <Subtitle />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Torrent from "@/components/Torrent.vue";
import Subtitle from "@/components/Subtitle.vue";

export default {
  name: "download",
  components: {
    Torrent,
    Subtitle
  },

  computed: {
    ...mapGetters(["getFilmName", "getFilmYear", "getFilmCover"])
  }
};
</script>
