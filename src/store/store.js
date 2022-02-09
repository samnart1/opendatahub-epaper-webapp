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
    resolutions: [],
    displaySchedules: {},
    URI: process.env.VUE_APP_API_URL,
    authenticated: false,
    axiosKeycloakConfig: null,
    dataLoaded: false,
  },

  getters: {
    displays: state => state.displays,
    locations: state => state.locations,
    connections: state => state.connections,
    templates: state => state.templates,
    rooms: state => state.rooms,
    resolutions: state => state.resolutions,
    displaySchedules: state => state.displaySchedules,
    authenticated: state => state.authenticated
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
    SET_RESOLUTIONS(state, resolutions) {
      state.resolutions = resolutions;
    },
    SET_DISPLAY_SCHEDULE(state, { schedule, displayUuid }) {
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
      const idField = updatedSchedule.eventId ? "eventId" : "uuid";

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
    UPDATE_DISPLAY_CONTENT(state, updatedContent) {
      let index = state.displays.indexOf(
        state.displays.filter(display => display.uuid == updatedContent.displayUuid)[0]
      );
      if (index > -1) {
        Vue.set(state.displays[index], "displayContent", updatedContent.displayContent);
      }
    },
    UPDATE_TEMPLATE_CONTENT(state, updatedContent) {
      let index = state.templates.indexOf(
        state.templates.filter(templates => templates.uuid == updatedContent.templateUuid)[0]
      );
      if (index > -1) {
        Vue.set(state.templates[index], "displayContent", updatedContent.displayContent);
      }
    },
    UPDATE_SCHEDULED_CONTENT(state, updatedContent) {
      const flatScheduledContents = Object.keys(state.displaySchedules).reduce(function (r, k) {
        return r.concat(state.displaySchedules[k]);
      }, []);
      let index = flatScheduledContents.indexOf(
        flatScheduledContents.filter(sc => sc.uuid == updatedContent.scheduledContentUuid)[0]
      );
      if (index > -1) {
        Vue.set(flatScheduledContents[index], "displayContent", updatedContent.displayContent);
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
    },
    SET_AUTHENTICATED(state, authenticated) {
      state.authenticated = authenticated;
    },
    SET_AXIOS_KEYCLOAK_CONFIG(state, token) {
      state.axiosKeycloakConfig = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    },
    SET_DATA_LOADED(state, dataLoaded) {
      state.dataLoaded = dataLoaded;
    },
  },

  actions: {
    loadData({ commit }) {
      Promise.all([
        axios
          .get(this.state.URI + `/display/all`, this.state.axiosKeycloakConfig),
        axios
          .get(this.state.URI + `/location/all`, this.state.axiosKeycloakConfig),
        axios
          .get(this.state.URI + `/template/all`, this.state.axiosKeycloakConfig),
        axios
          .get(this.state.URI + `/resolution/all`, this.state.axiosKeycloakConfig),
        axios
          .get(this.state.URI + `/NOI-Place/all`, this.state.axiosKeycloakConfig)
      ]).then(responses => {
        commit("SET_DISPLAYS", responses[0].data);
        commit("SET_LOCATIONS", responses[1].data);
        commit("SET_TEMPLATES", responses[2].data);
        commit("SET_RESOLUTIONS", responses[3].data);
        commit("SET_ROOMS", responses[4].data);
        commit("SET_DATA_LOADED", true);
      }).catch(() => commit("SET_DATA_LOADED", true))
    },

    loadDisplaySchedule({ commit }, displayUuid) {
      axios
        .get(this.state.URI + `/ScheduledContent/all?displayUuid=${displayUuid}`, this.state.axiosKeycloakConfig)
        .then(response => commit("SET_DISPLAY_SCHEDULE", { schedule: response.data, displayUuid }));
    },

    createDisplay({ commit }, display) {
      const URL = this.state.URI + "/display/create";
      return axios
        .post(URL, display, this.state.axiosKeycloakConfig)
        .then(response => {
          commit("ADD_DISPLAY", response.data);
          return Promise.resolve(response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    createLocation({ commit }, location) {
      const URL = this.state.URI + "/location/create";
      axios
        .post(URL, location, this.state.axiosKeycloakConfig)
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
        .post(URL, connection, this.state.axiosKeycloakConfig)
        .then(response => {
          commit("ADD_CONNECTION", response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    createTemplate({ commit }, template) {
      const URL = this.state.URI + "/template/create";
      return axios
        .post(URL, template, this.state.axiosKeycloakConfig)
        .then(response => {
          commit("ADD_TEMPLATE", response.data);
          return Promise.resolve(response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    createDisplaySchedule({ commit }, schedule) {
      const URL = this.state.URI + "/ScheduledContent/create";
      return axios
        .post(URL, schedule, this.state.axiosKeycloakConfig)
        .then(response => {
          commit("ADD_DISPLAY_SCHEDULE", response.data);
          return Promise.resolve(response.data);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    deleteDisplay({ commit }, display) {
      const URL = this.state.URI + "/display/delete/" + display.uuid;
      axios
        .delete(URL, this.state.axiosKeycloakConfig)
        .then(commit("DELETE_DISPLAY", display))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    deleteLocation({ commit }, location) {
      const URL = this.state.URI + "/location/delete/" + location.uuid;
      axios
        .delete(URL, this.state.axiosKeycloakConfig)
        .then(commit("DELETE_LOCATION", location))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    deleteConnection({ commit }, connection) {
      const URL = this.state.URI + "/connection/delete/" + connection.uuid;
      axios
        .delete(URL, this.state.axiosKeycloakConfig)
        .then(commit("DELETE_CONNECTION", connection))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    deleteTemplate({ commit }, template) {
      const URL = this.state.URI + "/template/delete/" + template.uuid;
      return axios
        .delete(URL, this.state.axiosKeycloakConfig)
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
        .delete(URL, this.state.axiosKeycloakConfig)
        .then(() => commit("DELETE_DISPLAY_SCHEDULE", schedule))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    updateDisplay({ commit }, data) {
      const URL = this.state.URI + "/display/update/";
      return axios
        .put(URL, data, this.state.axiosKeycloakConfig)
        .then(response => {
          commit("UPDATE_DISPLAY", response.data);
          return Promise.resolve();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    updateLocation({ commit }, location) {
      const URL = this.state.URI + "/location/update";
      axios
        .put(URL, location, this.state.axiosKeycloakConfig)
        .then(commit("UPDATE_LOCATION", location))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    updateTemplate({ commit }, template) {
      const URL = this.state.URI + "/template/update";
      return axios
        .put(URL, template, this.state.axiosKeycloakConfig)
        .then(() => {
          commit("UPDATE_TEMPLATE", template);
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
        .put(URL, connection, this.state.axiosKeycloakConfig)
        .then(commit("UPDATE_CONNECTION", connection))
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
        });
    },

    updateDisplaySchedule({ commit }, schedule) {
      const URL = this.state.URI + "/ScheduledContent/update";
      return axios
        .put(URL, schedule, this.state.axiosKeycloakConfig)
        .then((response) => {
          //If server indicates that a new resource was created, we have to use server response for UUID
          if (response.status === 201) {
            commit("UPDATE_DISPLAY_SCHEDULE", response.data);
            return Promise.resolve(response.data);
          } else {
            commit("UPDATE_DISPLAY_SCHEDULE", schedule);
            return Promise.resolve();
          }
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    updateDisplayContent({ commit }, data) {
      let URL;
      let postData;
      if (data.image || !data.templateUuid) {
        URL = `${this.state.URI}/display/set-new-image/${data.displayUuid}`;
        postData = new FormData();
        postData.append("displayContentDtoJson", JSON.stringify(data.displayContent));
        postData.append("image", data.image);
      } else {
        URL = `${this.state.URI}/display/set-template-image/${data.displayUuid}?templateUuid=${data.templateUuid}`;
        postData = data.displayContent;
      }

      return axios
        .post(URL, postData, this.state.axiosKeycloakConfig)
        .then(() => {
          commit("UPDATE_DISPLAY_CONTENT", { displayUuid: data.displayUuid, displayContent: data.displayContent });
          return Promise.resolve();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    updateScheduledContent({ commit }, data) {
      let URL;
      let postData;
      if (data.image || !data.templateUuid) {
        URL = `${this.state.URI}/ScheduledContent/set-new-image/${data.scheduledContentUuid}`;
        postData = new FormData();
        postData.append("displayContentDtoJson", JSON.stringify(data.displayContent));
        postData.append("image", data.image);
      } else {
        URL = `${this.state.URI}/ScheduledContent/set-template-image/${data.scheduledContentUuid}?templateUuid=${data.templateUuid}`;
        postData = data.displayContent;
      }

      return axios
        .post(URL, postData, this.state.axiosKeycloakConfig)
        .then(() => {
          commit("UPDATE_SCHEDULED_CONTENT", { scheduledContentUuid: data.scheduledContentUuid, displayContent: data.displayContent });
          return Promise.resolve();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    updateTemplateContent({ commit }, data) {
      const URL = `${this.state.URI}/template/set-image/${data.templateUuid}`;

      let formData = new FormData();
      formData.append("displayContentDtoJson", JSON.stringify(data.displayContent));
      formData.append("image", data.image);

      return axios
        .post(URL, formData, this.state.axiosKeycloakConfig)
        .then(() => {
          commit("UPDATE_TEMPLATE_CONTENT", { templateUuid: data.templateUuid, displayContent: data.displayContent });
          return Promise.resolve();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          return Promise.reject();
        });
    },

    setAuthenticated({ commit }, authenticated) {
      commit("SET_AUTHENTICATED", authenticated)
    },

    setToken({ commit }, token) {
      commit("SET_AXIOS_KEYCLOAK_CONFIG", token)
    },

    invert({ commit }, display) {
      commit("INVERT", display)
    },

    isLoading({ commit }, [display, value]) {
      commit("IS_LOADING", [display, value])
    }
  }
});
