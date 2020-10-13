import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movable: true,
    autoHide: true,
    hideDelay: 5,
    impTypes: ["greetings"],

    emotion: "xiaolian"
  },
  mutations: {
    setEmotion(state, emotion) {
      state.emotion = emotion;
    }
  },
  actions: {
  },
  modules: {
  }
})
