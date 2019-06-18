const path = require("path")
module.exports = {
  publicPath: "/",
  css: {
    sourceMap: true
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" }
      }
    }
  },
  configureWebpack: {
    devtool: "source-map",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@comp": path.resolve(__dirname, "src/components"),
        "@pages": path.resolve(__dirname, "src/components/pages")
      }
    }
  },
  pages: {
    index: "src/components/pages/app.js",
    timeline: {
      entry: "src/components/pages/timeline/timeline.js",
      template: "public/pages/timeline.html"
    }
  }
}
