<template></template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import store from "@/store";
import axios from "../axios";

export default defineComponent({
  created() {
    this.getData();
  },
  methods: {
    getData() {
      axios
        .post("/personal_fm", { cookie: localStorage.getItem("cookie") || "" })
        .then((res) => {
          console.log(res);
          let fmPlaylist:Array<object> = [];
          res.data.data.forEach((music: any) => {
            let artists: Array<string> = [];
            music.artists.forEach((artist: any) => {
              artists.push(artist.name);
            });
            let musicInfo = {
              id: music.id,
              name: music.name,
              artist: artists,
            };
            fmPlaylist.push(musicInfo)
          });
          console.log(fmPlaylist); 
          store.commit("switchPlayerMode", "fm");
          store.commit("replacePlaylist", {
            playlist: fmPlaylist,
            cursor: 0,
          });
        });
    },
  },
});
</script>
