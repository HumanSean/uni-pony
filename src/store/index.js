import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movable: true,
    autoHide: true,
    hideDelay: 5,
    impTypes: ["greetings"],

    mood: "xiaolian",

    shortcuts: [
      { name: "main", key: "a" },
      { name: "buddy", key: "s" },
      { name: "efficiency", key: "d" },
      { name: "relax", key: "f" },
      { name: "settings", key: "q" },
      { name: "mood", key: "e" },
      { name: "notebook", key: "1" },
      { name: "todolist", key: "2" },
      { name: "tomato", key: "3" },
      { name: "music", key: "4" },
      { name: "movie", key: "5" },
      { name: "game", key: "6" },
      { name: "chat", key: "7" },
      { name: "weather", key: "8" },
      { name: "diary", key: "9" },
    ]
  },
  getters: {
    shortcutsMap: state => {
      let map = {};
      state.shortcuts.forEach(item => {
        map[item.key] = item.name;
      });
      return map;
    },
  },
  mutations: {
    setMood(state, mood) {
      state.mood = mood;
    }
  },
  actions: {
  },
  modules: {
  }
})
