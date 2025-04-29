// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    displays: [],
    templates: [],
    rooms: [],
    resolutions: [],
    displaySchedules: {},
    URI: process.env.VUE_APP_API_URL,
    authenticated: false,
    axiosKeycloakConfig: null,
    dataLoaded: false,
  },

  getters: {
    displays: state => state.displays,
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
      });
    },
    SET_TEMPLATES(state, templates) {
      state.templates = templates;
    },
    SET_ROOMS(state, rooms) {
      // prepare structure
      rooms = rooms.map((room) => {
        return {
          name: room.name ? `${room.name} (${room.label})` : room.label,
          code: room.code,
        };
      });
      // sort alphabetically
      rooms.sort((a, b) => a.name.localeCompare(b.name));
      // assign
      state.rooms = rooms;
    },
    SET_RESOLUTIONS(state, resolutions) {
      state.resolutions = resolutions;
    },
    SET_DISPLAY_SCHEDULE(state, { schedule, displayUuid }) {
      Vue.set(state.displaySchedules, displayUuid, schedule);
    },

    ADD_DISPLAY(state, display) {
      display.isLoading = false;
      display.inverted = false;
      state.displays.push(display);
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
      const index = state.displays.indexOf(display);
      if (index > -1) {
        state.displays.splice(index, 1);
      }
    },
    DELETE_TEMPLATE(state, template) {
      const index = state.templates.indexOf(template);
      if (index > -1) {
        state.templates.splice(index, 1);
      }
    },
    DELETE_DISPLAY_SCHEDULE(state, schedule) {
      const schedules = state.displaySchedules[schedule.displayUuid] || [];
      const index = schedules.indexOf(schedule);
      if (index > -1) {
        schedules.splice(index, 1);
      }
    },

    UPDATE_DISPLAY(state, updatedDisplay) {
      const index = state.displays.findIndex(display => display.uuid === updatedDisplay.uuid);
      if (index > -1) {
        Vue.set(state.displays, index, updatedDisplay);
      }
    },

    UPDATE_TEMPLATE(state, updatedTemplate) {
      const index = state.templates.findIndex(template => template.uuid === updatedTemplate.uuid);
      if (index > -1) {
        Vue.set(state.templates, index, updatedTemplate);
      }
    },

    UPDATE_DISPLAY_SCHEDULE(state, updatedSchedule) {
      const schedules = state.displaySchedules[updatedSchedule.displayUuid];
      if (!schedules) return;
      //In case of first edit there is no uuid on schedule, so we have to find edited schedule by event ID instead
      const idField = updatedSchedule.eventId ? "eventId" : "uuid";
      const index = schedules.findIndex(schedule => schedule[idField] === updatedSchedule[idField]);
      if (index > -1) {
        const targetSchedule = schedules[index];
        //Need to preserve original event information
        updatedSchedule.originalStartDate = targetSchedule.originalStartDate;
        updatedSchedule.originalEndDate = targetSchedule.originalEndDate;
        updatedSchedule.originalEventDescription = targetSchedule.originalEventDescription;
        Vue.set(schedules, index, updatedSchedule);
      }
    },
    UPDATE_DISPLAY_CONTENT(state, updatedContent) {
      const index = state.displays.findIndex(display => display.uuid === updatedContent.displayUuid);
      if (index > -1) {
        Vue.set(state.displays[index], "displayContent", updatedContent.displayContent);
      }
    },
    UPDATE_TEMPLATE_CONTENT(state, updatedContent) {
      const index = state.templates.findIndex(template => template.uuid === updatedContent.templateUuid);
      if (index > -1) {
        Vue.set(state.templates[index], "displayContent", updatedContent.displayContent);
      }
    },
    UPDATE_SCHEDULED_CONTENT(state, updatedContent) {
      // Flatten all scheduled contents
      const flatScheduledContents = Object.values(state.displaySchedules).reduce((r, arr) => r.concat(arr), []);
      const index = flatScheduledContents.findIndex(sc => sc.uuid === updatedContent.scheduledContentUuid);
      if (index > -1) {
        Vue.set(flatScheduledContents[index], "displayContent", updatedContent.displayContent);
      }
      // NOTE: This will not update the object in the original array due to reference issues.
      // To fix: Also update within the original displaySchedules arrays.
      for (const key in state.displaySchedules) {
        const schedules = state.displaySchedules[key];
        const idx = schedules.findIndex(sc => sc.uuid === updatedContent.scheduledContentUuid);
        if (idx > -1) {
          Vue.set(schedules[idx], "displayContent", updatedContent.displayContent);
        }
      }
    },
    INVERT(state, display) {
      const index = state.displays.indexOf(display);
      if (index > -1) {
        state.displays[index].inverted = !state.displays[index].inverted;
        Vue.set(state.displays, index, state.displays[index]);
      }
    },
    IS_LOADING(state, [display, value]) {
      const index = state.displays.indexOf(display);
      if (index > -1) {
        state.displays[index].isLoading = value;
        Vue.set(state.displays, index, state.displays[index]);
      }
    },
    SET_AUTHENTICATED(state, authenticated) {
      state.authenticated = authenticated;
    },
    SET_AXIOS_KEYCLOAK_CONFIG(state, token) {
      state.axiosKeycloakConfig = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };
    },
    SET_DATA_LOADED(state, dataLoaded) {
      state.dataLoaded = dataLoaded;
    },
  },

  actions: {
    loadData({ commit, state }) {
      Promise.all([
        axios
          .get(state.URI + `/display/all`, state.axiosKeycloakConfig),
        axios
          .get(state.URI + `/template/all`, state.axiosKeycloakConfig),
        axios
          .get(state.URI + `/resolution/all`, state.axiosKeycloakConfig),
        axios
          .get(state.URI + `/NOI-Place/all`, state.axiosKeycloakConfig)
      ]).then(responses => {
        commit("SET_DISPLAYS", responses[0].data);
        commit("SET_TEMPLATES", responses[1].data);
        commit("SET_RESOLUTIONS", responses[2].data);
        commit("SET_ROOMS", responses[3].data);
        commit("SET_DATA_LOADED", true);
      }).catch(() => commit("SET_DATA_LOADED", true));
    },

    loadDisplaySchedule({ commit, state }, displayUuid) {
      axios
        .get(state.URI + `/ScheduledContent/all?displayUuid=${displayUuid}`, state.axiosKeycloakConfig)
        .then(response => commit("SET_DISPLAY_SCHEDULE", { schedule: response.data, displayUuid }));
    },

    createDisplay({ commit, state }, display) {
      const URL = state.URI + "/display/create";
      return axios
        .post(URL, display, state.axiosKeycloakConfig)
        .then(response => {
          commit("ADD_DISPLAY", response.data);
          return Promise.resolve(response.data);
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    createTemplate({ commit, state }, template) {
      const URL = state.URI + "/template/create";
      return axios
        .post(URL, template, state.axiosKeycloakConfig)
        .then(response => {
          commit("ADD_TEMPLATE", response.data);
          return Promise.resolve(response.data);
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    createDisplaySchedule({ commit, state }, schedule) {
      const URL = state.URI + "/ScheduledContent/create";
      return axios
        .post(URL, schedule, state.axiosKeycloakConfig)
        .then(response => {
          commit("ADD_DISPLAY_SCHEDULE", response.data);
          return Promise.resolve(response.data);
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    deleteDisplay({ commit, state }, display) {
      const URL = state.URI + "/display/delete/" + display.uuid;
      return axios
        .delete(URL, state.axiosKeycloakConfig)
        .then(() => {
          commit("DELETE_DISPLAY", display);
          return Promise.resolve();
        })
        .catch(err => {
          console.log(err);
        });
    },

    deleteTemplate({ commit, state }, template) {
      const URL = state.URI + "/template/delete/" + template.uuid;
      return axios
        .delete(URL, state.axiosKeycloakConfig)
        .then(() => {
          commit("DELETE_TEMPLATE", template);
          return Promise.resolve();
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    deleteDisplaySchedule({ commit, state }, schedule) {
      const URL = state.URI + "/ScheduledContent/delete/" + schedule.uuid;
      return axios
        .delete(URL, state.axiosKeycloakConfig)
        .then(() => {
          commit("DELETE_DISPLAY_SCHEDULE", schedule);
          return Promise.resolve();
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    updateDisplay({ commit, state }, data) {
      const URL = state.URI + "/display/update/";
      return axios
        .put(URL, data, state.axiosKeycloakConfig)
        .then(response => {
          commit("UPDATE_DISPLAY", response.data);
          return Promise.resolve();
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    updateTemplate({ commit, state }, template) {
      const URL = state.URI + "/template/update";
      return axios
        .put(URL, template, state.axiosKeycloakConfig)
        .then(() => {
          commit("UPDATE_TEMPLATE", template);
          return Promise.resolve();
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    updateDisplaySchedule({ commit, state }, schedule) {
      const URL = state.URI + "/ScheduledContent/update";
      return axios
        .put(URL, schedule, state.axiosKeycloakConfig)
        .then((response) => {
          if (response.status === 201) {
            commit("UPDATE_DISPLAY_SCHEDULE", response.data);
            return Promise.resolve(response.data);
          } else {
            commit("UPDATE_DISPLAY_SCHEDULE", schedule);
            return Promise.resolve();
          }
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    updateDisplayContent({ commit, state }, data) {
      let URL;
      let postData;
      if (data.image || !data.templateUuid) {
        URL = `${state.URI}/display/set-new-image/${data.displayUuid}`;
        postData = new FormData();
        postData.append("displayContentDtoJson", JSON.stringify(data.displayContent));
        postData.append("image", data.image);
      } else {
        URL = `${state.URI}/display/set-template-image/${data.displayUuid}?templateUuid=${data.templateUuid}`;
        postData = data.displayContent;
      }

      return axios
        .post(URL, postData, state.axiosKeycloakConfig)
        .then(() => {
          commit("UPDATE_DISPLAY_CONTENT", { displayUuid: data.displayUuid, displayContent: data.displayContent });
          return Promise.resolve();
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    updateScheduledContent({ commit, state }, data) {
      let URL;
      let postData;
      if (data.image || !data.templateUuid) {
        URL = `${state.URI}/ScheduledContent/set-new-image/${data.scheduledContentUuid}`;
        postData = new FormData();
        postData.append("displayContentDtoJson", JSON.stringify(data.displayContent));
        postData.append("image", data.image);
      } else {
        URL = `${state.URI}/ScheduledContent/set-template-image/${data.scheduledContentUuid}?templateUuid=${data.templateUuid}`;
        postData = data.displayContent;
      }

      return axios
        .post(URL, postData, state.axiosKeycloakConfig)
        .then(() => {
          commit("UPDATE_SCHEDULED_CONTENT", { scheduledContentUuid: data.scheduledContentUuid, displayContent: data.displayContent });
          return Promise.resolve();
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    updateTemplateContent({ commit, state }, data) {
      const URL = `${state.URI}/template/set-image/${data.templateUuid}`;

      let formData = new FormData();
      formData.append("displayContentDtoJson", JSON.stringify(data.displayContent));
      formData.append("image", data.image);

      return axios
        .post(URL, formData, state.axiosKeycloakConfig)
        .then(() => {
          commit("UPDATE_TEMPLATE_CONTENT", { templateUuid: data.templateUuid, displayContent: data.displayContent });
          return Promise.resolve();
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(err.response?.data);
        });
    },

    setAuthenticated({ commit }, authenticated) {
      commit("SET_AUTHENTICATED", authenticated);
    },

    setToken({ commit }, token) {
      commit("SET_AXIOS_KEYCLOAK_CONFIG", token);
    },

    invert({ commit }, display) {
      commit("INVERT", display);
    },

    isLoading({ commit }, [display, value]) {
      commit("IS_LOADING", [display, value]);
    }
  }
});

