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
    displaySchedules: {},
    URI: process.env.VUE_APP_API_URL
  },

  getters: {
    displays: state => state.displays,
    locations: state => state.locations,
    connections: state => state.connections,
    templates: state => state.templates,
    rooms: state => state.rooms,
    displaySchedules: state => state.displaySchedules
  },

  mutations: {
    SET_DISPLAYS(state, displays) {
      state.displays = displays;
      state.displays.forEach(display => {
        display.isLoading = false;
        display.inverted = false;
      })
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
    SET_ROOMS(state, rooms) {
      state.rooms = rooms.map((room) => {
        return {
          name: room.name ? `${room.name} (${room.label})` : room.label,
          code: room.code,
        };
      });
    },
    SET_DISPLAY_SCHEDULE(state, {schedule, displayUuid}) {
      Vue.set(state.displaySchedules, displayUuid, schedule);
    },

    ADD_DISPLAY(state, display) {
      state.displays.push(display);
      display.isLoading = false;
      display.inverted = false;
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
    ADD_DISPLAY_SCHEDULE(state, schedule) {
      if (!state.displaySchedules[schedule.displayUuid]) {
        Vue.set(state.displaySchedules, schedule.displayUuid, []);
      }
      // eslint-disable-next-line no-console
      console.log(schedule);
      state.displaySchedules[schedule.displayUuid].push(schedule);
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
    DELETE_DISPLAY_SCHEDULE(state, schedule) {
      var index = state.displaySchedules[schedule.displayUuid].indexOf(schedule);
      if (index > -1) {
        state.displaySchedules[schedule.displayUuid].splice(index, 1);
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
        Vue.set(state.templates, index, updatedTemplate);
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
    },
    UPDATE_DISPLAY_SCHEDULE(state, updatedSchedule) {
      //In case of first edit there is no uuid on schedule, so we have to find edited schedule by event ID instead
      const idField = updatedSchedule.uuid ? "uuid" : "eventId";

      let index = state.displaySchedules[updatedSchedule.displayUuid].indexOf(
        state.displaySchedules[updatedSchedule.displayUuid].filter(schedule => schedule[idField] == updatedSchedule[idField])[0]
      );
      if (index > -1) {
        let targetSchedule = state.displaySchedules[updatedSchedule.displayUuid][index]

        //Need to preserve original event information
        updatedSchedule.originalStartDate = targetSchedule.originalStartDate;
        updatedSchedule.originalEndDate = targetSchedule.originalEndDate;
        updatedSchedule.originalEventDescription = targetSchedule.originalEventDescription;

        Vue.set(state.displaySchedules[updatedSchedule.displayUuid], index, updatedSchedule);
      }
    },

    INVERT(state, display) {
      var index = state.displays.indexOf(display);
      Vue.set(state.displays, index, display)
      if (index > -1) {
        state.displays[index].inverted = !state.displays[index].inverted
      }
    },
    IS_LOADING(state, [display, value]) {
      var index = state.displays.indexOf(display);
      if (index > -1) {
        state.displays[index].isLoading = value
      }
      Vue.set(state.displays, index, display)
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
      axios
        .get(this.state.URI + `/NOI-Place/all`)
        .then(response => commit("SET_ROOMS", response.data));
    },

    loadDisplaySchedule({ commit }, displayUuid) {
      axios
        .get(this.state.URI + `/ScheduledContent/all?displayUuid=${displayUuid}`)
        .then(response => commit("SET_DISPLAY_SCHEDULE", { schedule: response.data, displayUuid }));
    },

    createDisplay({ commit }, data) {
      let formData = new FormData();
      formData.append("name", data.name);
      formData.append("templateUuid", data.templateUuid);
      formData.append("width", data.width);
      formData.append("height", data.height);
      formData.append("locationUuid", data.locationUuid);

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
      formData.append("locationUuid", data.locationUuid)
      formData.append("networkAddress", data.networkAddress)


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
      formData.append("template", JSON.stringify(data.template));
      formData.append("image", data.image);

      return axios
        .post(URL, formData)
        .then(response => {
          commit("ADD_TEMPLATE", response.data);
          return Promise.resolve();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    createDisplaySchedule({ commit }, schedule) {
      const URL = this.state.URI + "/ScheduledContent/create";
      axios
        .post(URL, schedule)
        .then(response => {
          commit("ADD_DISPLAY_SCHEDULE", response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    createDisplaySchedule({ commit }, schedule) {
      const URL = this.state.URI + "/ScheduledContent/create";
      axios
        .post(URL, schedule)
        .then(response => {
          commit("ADD_DISPLAY_SCHEDULE", response.data);
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
      return axios
        .delete(URL)
        .then(() => {
          commit("DELETE_TEMPLATE", template);
          return Promise.resolve();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    deleteDisplaySchedule({ commit }, schedule) {
      const URL = this.state.URI + "/ScheduledContent/delete/" + schedule.uuid;
      axios
        .delete(URL)
        .then(() => commit("DELETE_DISPLAY_SCHEDULE", schedule))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    deleteDisplaySchedule({ commit }, schedule) {
      const URL = this.state.URI + "/ScheduledContent/delete/" + schedule.uuid;
      axios
        .delete(URL)
        .then(() => commit("DELETE_DISPLAY_SCHEDULE", schedule))
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

    updateTemplate({ commit }, data) {
      const URL = this.state.URI + "/template/create";

      let formData = new FormData();
      formData.append("template", JSON.stringify(data.template));
      formData.append("image", data.image);

      return axios
        .post(URL, formData)
        .then(() => {
          commit("UPDATE_TEMPLATE", data.template);
          return Promise.resolve();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
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
    },

    updateDisplaySchedule({ commit }, schedule) {
      const URL = this.state.URI + "/ScheduledContent/update";
      axios
        .put(URL, schedule)
        .then(() => commit("UPDATE_DISPLAY_SCHEDULE", schedule))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    invert({ commit }, display) {
      commit("INVERT", display)
    },

    isLoading({ commit }, [display, value]) {
      commit("IS_LOADING", [display, value])
    }
  }
});
