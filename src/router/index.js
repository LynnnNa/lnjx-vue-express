import Vue from "vue"
import Router from "vue-router"
import App from "@pages/App.vue"

Vue.use(Router)

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: App
    },
    {
      path: "/setting",
      name: "SettingApp",
      component: () =>
        import(/* webpackChunkName:"SettingApp" */ "@pages/setting/index.vue")
    }
    ,
    {
      path: "/jobber",
      name: "jobber",
      component: () =>
        import(/* webpackChunkName:"SettingApp" */ "@pages/jobber/index.vue")
    }
  ]
})
