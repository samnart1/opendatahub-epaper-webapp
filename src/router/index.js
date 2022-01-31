import Vue from "vue";
import Router from "vue-router";
import Displays from "@/components/displays/Displays.vue";
import DisplayForm from "@/components/displays/DisplayForm.vue";
import Login from "@/components/Login.vue";
import Locations from "@/components/locations/Locations.vue";
import LocationForm from "@/components/locations/LocationForm.vue";
import Templates from "@/components/templates/Templates.vue";
import TemplateForm from "@/components/templates/TemplateForm.vue";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: {
        name: "Displays"
      }
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/displays",
      name: "Displays",
      component: Displays
    },
    {
      path: "/display-form",
      name: "Display Form",
      component: DisplayForm,
      props: true
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
