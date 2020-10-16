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
    ],

    songs: [
      {
        songId: "1942100",
        name: "The Crow & The Butterfly",
        artist: "Shinedown",
        list: ["iTunes Session"],
      },
      {
        songId: "1312166075",
        name: "This Is Me",
        artist: "Andy Brown",
        list: ["精选歌单"],
      },
      {
        songId: "20752256",
        name: "Shadows and Regrets",
        artist: "Yellowcard",
        list: ["精选歌单"],
      },
      {
        songId: "21600137",
        name: "Rest",
        artist: "Syd Matters",
        list: ["精选歌单"],
      },
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
    playlist: state => {
      let results = {
        "所有歌曲": state.songs,
      };
      state.songs.forEach(song => {
        song.list.forEach(list => {
          if (!results[list]) {
            results[list] = [];
          }
          results[list].push(song);
        })
      });
      return results;
    },
    lists: (state, getters) => {
      return Object.keys(getters.playlist);
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
