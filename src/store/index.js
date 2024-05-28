import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    menuItems: [
      // {
      //   // id: 1,
      //   name: "首页",
      //   url: "/",
      // },
      // {
      //   // id: 2,
      //   name: "关于",
      //   url: "/about",
      // },
      // {
      //   // id: 3,
      //   name: "联系我们",
      //   url: "/contact",
      // },
    ],
  },
  mutations: {
    addRoute(state, routeItem) {
      state.menuItems.push(routeItem);
    },
    clearState(state) {
      // 重置状态
      state = null;
    },
  },
  actions: {
    addRoute(context) {
      context.commit("addRoute");
    },
    clearState({ commit }) {
      commit("clearState");
    },
  },
  // plugins: [
  //   createPersistedState({
  //     storage: window.localStorage, // 指定存储方式为 localStorage
  //   }),
  // ],
});
