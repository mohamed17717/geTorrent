<template>
  <div id="app" class="home">
    <Top />
    <!-- <Download /> -->
    <!-- <Images /> -->
    <Bottom />
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
// import Download from '@/components/Download.vue'
// import Images from '@/components/Images.vue'
import Bottom from "@/components/Bottom.vue";

export default {
  name: "app",
  components: {
    Top,
    // Download,
    // Images,
    Bottom
  }
};
</script>
