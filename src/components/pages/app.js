import Vue from "vue"
import ElementUI from "element-ui"
import "@assets/app.scss"
import router from "@/router"
Vue.config.productionTip = false //启动生产消息
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h("router-view")
}).$mount("#app")
