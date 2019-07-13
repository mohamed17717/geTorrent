<template>
  <div id="app" class="home">
    <Top />
    <Download />
    <Images />
    <Bottom />
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
import Download from "@/components/Download.vue";
import Images from "@/components/Images.vue";
import Bottom from "@/components/Bottom.vue";

export default {
  name: "app",
  components: {
    Top,
    Download,
    Images,
    Bottom
  },

  metaInfo: {
    title: "geTorrent",
    link: [
      // logo font
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Electrolize&amp;display=swap"
      },
      // arabic font
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Tajawal&amp;display=swap"
      },
      // icons fontawesome
      {
        rel: "stylesheet",
        href:
          "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
        integrity:
          "sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN",
        crossorigin: "anonymous"
      }
    ]
  }
};
</script>
