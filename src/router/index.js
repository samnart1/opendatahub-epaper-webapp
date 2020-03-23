import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import Login from "@/components/Login.vue";
import Create from "@/components/create/Create.vue";
import Update from "@/components/update/Update.vue";
import SimpleCreate from "@/components/create/SimpleCreate";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: {
        name: "login"
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/simple-create",
      name: "Simple Create",
      component: SimpleCreate
    },
    {
      path: "/create",
      name: "Create",
      component: Create
    },
    {
      path: "/update",
      name: "Edit",
      component: Update
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard
    }
  ]
});
