import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./router";
import axios from "axios";
import "../node_modules/dat.gui/build/dat.gui.js";
import "../node_modules/dat.gui/build/dat.gui.css";
Vue.config.productionTip = false;
Vue.prototype.axios = axios;
// axios.defaults.withCredentials = true; //让ajax携带cookie
import store from "./store";
Vue.prototype.$store = store;
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
  router: router,

  beforeCreate() {
    Vue.prototype.$bus = this;
    const originalPush = VueRouter.prototype.push;
    VueRouter.prototype.push = function push(location) {
      return originalPush.call(this, location).catch((err) => err);
    };
  },
}).$mount("#app");
