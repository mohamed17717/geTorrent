<template>
  <div id="progress-bar">
    <div
      class="color"
      :class="{ hidden: progress >= 100 }"
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "progress-bar",
  data() {
    return {
      effectiveComponentsNum: 2
    };
  },
  computed: {
    progress() {
      return this.getProgressBar / this.effectiveComponentsNum;
    },

    ...mapGetters(["getProgressBar"])
  }
};
</script>

<style lang="scss" scoped>
#progress-bar {
  height: 3px;
  width: 90%;
  margin-bottom: 0;
  position: fixed;
  top: 0;
  overflow: hidden;
  z-index: 999999999999;

  .color {
    background-color: #2c3e50;
    height: 100%;

    visibility: visible;
    opacity: 1;
    transition: width 0.3s ease-in-out, opacity 0.7s ease-in-out;
  }

  .hidden {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.7s, opacity 0.7s ease-in-out;
  }
}
</style>
