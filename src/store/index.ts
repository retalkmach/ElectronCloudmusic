import { createStore } from 'vuex'

export default createStore({
  state: {
    musicID: 488388943,
    playlist:[{
      id:488388943,
      name:"光",
      artist:"當山みれい"
    }],
    playlistCursor:0,
    currentTime:0,
    showPlayer: false,
    setting:{}
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
