<template>
  <div>
    <div class="navbar">
      <div v-for="(item, index) in menuItems" :key="index">
        <!-- <a :href="'/#' + item.url">{{ item.name }}</a> -->
        <!-- <div @click="toPath(item.url)">{{ item.name }}</div> -->
        <router-link :to="`${item.url}`">{{ item.name }}</router-link>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["menuItems"]),
  },
  created() {
    console.log("route", this.$route);
  },
  mounted() {},

  methods: {
    toPath(url) {
      this.$router.push(url);
    },
  },
};
</script>
<style src="@/assets/style/navbar.css"  scoped></style>