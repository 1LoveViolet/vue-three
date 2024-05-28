import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
Vue.use(VueRouter);
const three1 = () => import("../views/three1/index.vue");
const three2 = () => import("../views/three2/index.vue");
const router = new VueRouter({
  // mode: "history", // history 模式去除地址栏 # 号
  routes: [
    {
      path: "/",
      redirect: "/three1",
      component: three1,
    },
    {
      path: "/three1",
      name: "three1",
      component: three1,
    },
    {
      path: "/three2",
      name: "three2",
      component: three2,
    },
  ],
  mode: "hash",
});
router.options.routes.map((item) => {
  console.log(item);
  if (item.name) {
    store.commit("addRoute", {
      name: item.name,
      url: item.path,
    });
  }
});

// router.beforeEach((to, from, next) => {
//   console.log(router);
//   console.log(to);
//   console.log(from);
//   console.log(store.state.menuItems);
//   next();
// });
// router.beforeEach(async (to, from, next) => {
//   // const res = this.$store.dispatch("addRout");
//   // console.log(res);
//   console.log(to);
//   console.log(store.state.menuItems);
// });
export default router;
