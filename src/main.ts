import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
Vue.use(BaklavaVuePlugin);
import "@baklavajs/plugin-renderer-vue/dist/styles.css";

import "./customBootstrap.scss";
import "bootstrap/dist/js/bootstrap.bundle.js";
import router from "./router";

new Vue({
    router,
    render: (h) => h(App)
}).$mount("#app");
