import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
Vue.use(BaklavaVuePlugin);
import "@baklavajs/plugin-renderer-vue/dist/styles.css";

import "bootstrap/dist/css/bootstrap.min.css";

new Vue({
    render: (h) => h(App)
}).$mount("#app");
