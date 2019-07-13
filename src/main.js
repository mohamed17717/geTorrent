import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import MyPlugin from "@/plugins";

Vue.config.productionTip = false;

Vue.use(MyPlugin);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
