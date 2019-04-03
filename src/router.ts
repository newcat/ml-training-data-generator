import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/settings", name: "settings" },
    { path: "/visualisation", name: "visualisation" },
    { path: "/preview", name: "preview" },
    { path: "/", name: "editor" }
  ]
});
