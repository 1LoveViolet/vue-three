const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    hot: true,
    client: {
      overlay: false,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        components: "@/components",
        assets: "@/assets",
        network: "@/network",
        views: "@/views",
        pages: "@/pages",
        store: "@/store",
        router: "@/router",
        api: "@/api",
        unti: "@/unti",
      },
    },
  },
  // 关闭语法检查
  lintOnSave: false,
  devServer: {
    client: {
      overlay: false,
    },
  },
});