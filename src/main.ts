import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import Baklava from "baklavajs";
Vue.use(Baklava);
import "baklavajs/dist/styles/all.scss";

import "bootstrap/dist/css/bootstrap.min.css";

new Vue({
    render: (h) => h(App)
}).$mount("#app");
