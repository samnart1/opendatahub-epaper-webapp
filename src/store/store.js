import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    displays: [],
    locations: [],
    connections: [],
    templates: [],
    isLoading: false,
    URI: process.env.VUE_APP_API_URL
  },

  getters: {
    displays: state => state.displays,
    locations: state => state.locations,
    connections: state => state.connections,
    templates: state => state.templates
  },

  mutations: {
    SET_DISPLAYS(state, displays) {
      state.displays = displays;
    },
    SET_LOCATIONS(state, locations) {
      state.locations = locations;
    },
    SET_CONNECTIONS(state, connections) {
      state.connections = connections;
    },
    SET_TEMPLATES(state, templates) {
      state.templates = templates;
    },

    ADD_DISPLAY(state, display) {
      state.displays.push(display);
    },
    ADD_LOCATION(state, location) {
      state.locations.push(location);
    },
    ADD_CONNECTION(state, connection) {
      state.connections.push(connection);
    },
    ADD_TEMPLATE(state, template) {
      state.templates.push(template);
    },

    DELETE_DISPLAY(state, display) {
      var index = state.displays.indexOf(display);
      if (index > -1) {
        state.displays.splice(index, 1);
      }
    },
    DELETE_LOCATION(state, location) {
      var index = state.locations.indexOf(location);
      if (index > -1) {
        state.locations.splice(index, 1);
      }
    },
    DELETE_CONNECTION(state, connection) {
      var index = state.connections.indexOf(connection);
      if (index > -1) {
        state.connections.splice(index, 1);
      }
    },
    DELETE_TEMPLATE(state, template) {
      var index = state.templates.indexOf(template);
      if (index > -1) {
        state.templates.splice(index, 1);
      }
    },

    UPDATE_DISPLAY(state, updatedDisplay) {
      var index = state.displays.indexOf(
        state.displays.filter(display => display.uuid == updatedDisplay.uuid)[0]
      );
      if (index > -1) {
        state.displays[index] = updatedDisplay;
      }
    },

    UPDATE_LOCATION(state, updatedLocation) {
      var index = state.locations.indexOf(
        state.locations.filter(
          location => location.uuid == updatedLocation.uuid
        )[0]
      );
      if (index > -1) {
        state.locations[index] = updatedLocation;
      }
    },

    UPDATE_TEMPLATE(state, updatedTemplate) {
      var index = state.templates.indexOf(
        state.templates.filter(
          template => template.uuid == updatedTemplate.uuid
        )[0]
      );
      if (index > -1) {
        state.templates[index] = updatedTemplate;
      }
    },

    UPDATE_CONNECTION(state, updatedConnection) {
      var index = state.connections.indexOf(
        state.connections.filter(
          connection => connection.uuid == updatedConnection.uuid
        )[0]
      );
      if (index > -1) {
        state.connections[index] = updatedConnection;
      }
    }
  },

  actions: {
    loadData({ commit }) {
      axios
        .get(this.state.URI + `/display/all`)
        .then(response => commit("SET_DISPLAYS", response.data));
      axios
        .get(this.state.URI + `/location/all`)
        .then(response => commit("SET_LOCATIONS", response.data));
      axios
        .get(this.state.URI + `/connection/all`)
        .then(response => commit("SET_CONNECTIONS", response.data));
      axios
        .get(this.state.URI + `/template/all`)
        .then(response => commit("SET_TEMPLATES", response.data));
    },

    createDisplay({ commit }, data) {
      let formData = new FormData();
      formData.append("name", data.name);
      formData.append("templateUuid", data.templateUuid);
      formData.append("width", data.width);
      formData.append("height", data.height);

      const URL = this.state.URI + "/display/create";
      axios
        .post(URL, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          commit("ADD_DISPLAY", response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    simpleCreateDisplay({ commit }, data) {
      let formData = new FormData();
      formData.append("name", data.name);
      formData.append("templateUuid", data.templateUuid);
      formData.append("width", data.width);
      formData.append("height", data.height);
      formData.append("connectionDto", data.connectionDto)

      const URL = this.state.URI + "/display/simple-create";
      axios
        .post(URL, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          commit("ADD_DISPLAY", response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    createLocation({ commit }, location) {
      const URL = this.state.URI + "/location/create";
      axios
        .post(URL, location)
        .then(response => {
          commit("ADD_LOCATION", response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    createConnection({ commit }, connection) {
      const URL = this.state.URI + "/connection/create";
      axios
        .post(URL, connection)
        .then(response => {
          commit("ADD_CONNECTION", response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    createTemplate({ commit }, data) {
      const URL = this.state.URI + "/template/create";
      let formData = new FormData();
      formData.append("name", data.name);
      formData.append("image", data.image);

      axios
        .post(URL, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          commit("ADD_TEMPLATE", response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    deleteDisplay({ commit }, display) {
      const URL = this.state.URI + "/display/delete/" + display.uuid;
      axios
        .delete(URL)
        .then(commit("DELETE_DISPLAY", display))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    deleteLocation({ commit }, location) {
      const URL = this.state.URI + "/location/delete/" + location.uuid;
      axios
        .delete(URL)
        .then(commit("DELETE_LOCATION", location))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    deleteConnection({ commit }, connection) {
      const URL = this.state.URI + "/connection/delete/" + connection.uuid;
      axios
        .delete(URL)
        .then(commit("DELETE_CONNECTION", connection))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    deleteTemplate({ commit }, template) {
      const URL = this.state.URI + "/template/delete/" + template.uuid;
      axios
        .delete(URL)
        .then(commit("DELETE_TEMPLATE", template))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    updateDisplay({ commit }, data) {
      const URL = this.state.URI + "/display/update/" + data.templateUuid;
      axios
        .put(URL, data.displayUpdated)
        .then(response => {
          commit("UPDATE_DISPLAY", response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    updateLocation({ commit }, location) {
      const URL = this.state.URI + "/location/update";
      axios
        .put(URL, location)
        .then(commit("UPDATE_LOCATION", location))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    updateTemplate({ commit }, template) {
      const URL = this.state.URI + "/template/update";
      axios
        .put(URL, template)
        .then(commit("UPDATE_TEMPLATE", template))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    updateConnection({ commit }, connection) {
      const URL = this.state.URI + "/connection/update";
      axios
        .put(URL, connection)
        .then(commit("UPDATE_CONNECTION", connection))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    }
  }
});
