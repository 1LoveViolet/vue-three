const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "./", // 基本路径
  outputDir: "dist", // 构建时的输出目录
  assetsDir: "static", // 放置静态资源的目录
  indexPath: "index.html", // html 的输出路径
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
