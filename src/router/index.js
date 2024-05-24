import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const three1 = () => import("../views/three1/index.vue");
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
      // redirect: "/edit/basic",
      component: three1,
    },
  ],
  mode: "hash",
});

// router.beforeEach((to, from, next) => {});
export default router;
