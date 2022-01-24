import Vue from "vue";
import Router from "vue-router";
import Displays from "@/components/displays/Displays.vue";
import Login from "@/components/Login.vue";
import Create from "@/components/create/Create.vue";
import Update from "@/components/update/Update.vue";
import SimpleCreate from "@/components/create/SimpleCreate";
import Locations from "@/components/locations/Locations.vue";
import LocationForm from "@/components/locations/LocationForm.vue";
import Templates from "@/components/templates/Templates.vue";
import TemplateForm from "@/components/templates/TemplateForm.vue";

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
      path: "/displays",
      name: "Displays",
      component: Displays
    },
    {
      path: "/locations",
      name: "Locations",
      component: Locations
    },
    {
      path: "/location-form",
      name: "Location Form",
      component: LocationForm,
      props: true
    },
    {
      path: "/templates",
      name: "Templates",
      component: Templates
    },
    {
      path: "/template-form",
      name: "Template Form",
      component: TemplateForm,
      props: true
    },
  ]
});
