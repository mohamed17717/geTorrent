<template>
  <div id="msg" v-if="getProgressBar >= 200 && !getFilmCover">
    ملاقيتش نتايج بحث مطابقة ... اتأكد من الاسم و السنة
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "not-found-message",
  computed: {
    ...mapGetters(["getFilmCover", "getProgressBar"])
  }
};
</script>
