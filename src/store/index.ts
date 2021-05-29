import { createStore } from 'vuex'

export default createStore({
  state: {
    musicID: 488388943,
    playlist:[{
      id:488388943,
      name:"光",
      artist:["當山みれい"]
    }],
    playlistCursor:0,
    currentTime:0,
    showPlayer: false,
    setting:{}
  },
  mutations: {
    changeMusicID(state,id:number){
      state.musicID = id;
    },
    addPlaylist(state,songData:any){
      for(let i=0;i<state.playlist.length;i++){
        if(songData.id == state.playlist[i].id){
          return false;
        }
      }
      state.playlist.splice(state.playlistCursor+1,0,songData);
      state.playlistCursor++;
    },
    changePlaylistCursor(state,cursor:number){
      if (cursor>state.playlist.length) return false;
      state.playlistCursor = cursor;
      state.musicID = state.playlist[cursor].id;
    },
    replacePlaylist(state,newData:any){
      state.playlist = newData.playlist;
      state.playlistCursor = newData.cursor;
    }
  },
  actions: {
  },
  modules: {
  }
})
