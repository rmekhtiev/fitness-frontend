import Vue from 'vue'
import Vuex from 'vuex'

export default {
  state: () => ({
    selectedHallId: null,
  }),

  mutations: {
    SELECT_HALL(state, hallId) {
      console.info("Selected hall: " + hallId);
      state.selectedHallId = hallId;
    },
  },

  actions: {
    selectHall({commit}, hall) {
      commit('SELECT_HALL', hall !== null ? hall.id : null)
    }
  },

  getters: {
    selectedHall(state, getters) {
      return getters['halls/byId']({id: state.selectedHallId});
    },

    selectedHallId(state) {
      return state.selectedHallId;
    },

    selectedHallIdForFilter(state) {
      return state.selectedHallId === null ? '*' : state.selectedHallId;
    }
  }
}
