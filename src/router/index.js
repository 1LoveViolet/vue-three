import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const three1 = () => import("../views/three1/index.vue");
const three2 = () => import("../views/three2/index.vue");
const router = new VueRouter({
  // mode: "history", // history 模式去除地址栏 # 号
  routes: [
    {
      path: "/",
      redirect: "/three2",
      component: three1,
    },
    {
      path: "/three1",
      component: three1,
    },
    {
      path: "/three2",
      component: three2,
    },
  ],
  mode: "hash",
});

// router.beforeEach((to, from, next) => {});
export default router;
