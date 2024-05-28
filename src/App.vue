<template>
  <div id="app">
    <navbar />
    <!-- <keep-alive> -->
    <router-view :key="$route.path"></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
const navbar = () => import("components/navbar/index.vue");
const three1 = () => import("views/three1/index.vue");
export default {
  name: "App",
  components: { three1, navbar },
  props: ["menuItems"],
  data() {
    return {};
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
body {
  background-color: rgb(0, 0, 0);
}
</style>
