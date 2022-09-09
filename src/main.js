import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import MyPlugin from "@/plugins";
import Meta from "vue-meta";

require("@/assets/css/style.css");

// require("@/assets/js/script.js");
require("@/assets/js/block-steal.js");
require("@/assets/js/header.js");
require("@/assets/js/notes.js");

Vue.config.productionTip = false;

Vue.use(MyPlugin);
Vue.use(Meta);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
