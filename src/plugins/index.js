// import my plugins
import filters from "./filters";
import request from "./request";
import helper from "./helper";
import constants from "./constants";

export default {
  install(Vue) {
    Vue.prototype.vueFunc = function() {
      return "i am from the plugin";
    };

    Vue.prototype.filters = filters;
    Vue.prototype.request = request;
    Vue.prototype.helper = helper;
    Vue.prototype.constants = constants;
  }
};
