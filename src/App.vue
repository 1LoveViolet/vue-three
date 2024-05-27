<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="transitionBody" :key="$route.fullPath"></router-view>
    </transition>
    <!-- <three1 /> -->
  </div>
</template>

<script>
const three1 = () => import("views/three1/index.vue");
export default {
  name: "App",
  components: { three1 },
  data() {
    return {
      transitionName: "transitionLeft",
    };
  },
  watch: {
    $route(to, from) {
      const arr = ["/three1"];
      this.transitionName =
        arr.indexOf(to.path) > arr.indexOf(from.path)
          ? "transitionLeft"
          : "transitionRight";
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
