<template>
  <main>
    <div id="album-info" v-if="data_loadready">
      <div id="img-container">
        <img :src="playlist_info.coverImgUrl" alt="" id="album-img" />
      </div>
      <div id="album-data">
        <h3 id="album-name">{{ playlist_info.name }}</h3>
        <p id="creator-info">
          <img :src="playlist_info.creator.avatarUrl" alt="" id="creator-avatar" />
          <span>{{ playlist_info.creator.nickname }}</span>
        </p>
        <p id="description">
          {{ playlist_info.briefDesc || playlist_info.description }}
        </p>
      </div>
    </div>
    <div id="songs" v-if="data_loadready">
      <ul v-if="songs.length != 0">
        <li
          v-for="(item, index) in songs"
          :key="item"
          v-bind:class="autoAddClass(index)"
        >
          <div class="title" v-on:click="playMusic(index)">
            {{ item.name }}
          </div>
          <div class="artists">
            <span v-for="artist in item.ar" :key="artist">
              <router-link :to="{ path: '/artist/' + artist.id }">{{
                artist.name
              }}</router-link>
            </span>
          </div>
          <div class="album">
            <router-link :to="{ path: '/album/' + item.al.id }">
              {{ item.al.name }}
            </router-link>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      
    </div>
  </main>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import axios from "../axios";
import store from "@/store";

export default defineComponent({
  setup() {},
  mounted() {
    this.getData();
  },
  data() {
    let songs: Array<any> = [];
    return {
      playlist_info: Object as any,
      songs: songs,
      data_loadready: false,
      // albumData: albumData
    };
  },
  methods: {
    getData() {
      axios
        .post(`/playlist/detail?id=${this.$route.params.playlistID}`,{ cookie: localStorage.getItem("cookie") })
        .then((res) => {
          console.log(res);
          this.songs = res.data.playlist.tracks;
          this.playlist_info = res.data.playlist;
          this.data_loadready = true;
        });
    },
    playMusic(index: number) {
      let newPlaylist = [];
      for (let i = 0; i < this.songs.length; i++) {
        let artists: Array<any> = [];
        let song = {
          id: this.songs[i].id,
          name: this.songs[i].name,
          artists: artists,
        };
        for (let j = 0; j < this.songs[i].ar.length; j++) {
          song.artists.push(j < this.songs[i].ar[j].name);
        }
        newPlaylist.push(song);
      }
      let newData = {
        playlist: newPlaylist,
        cursor: index,
      };
      store.commit("replacePlaylist", newData);
    },
    autoAddClass(index: number) {
      return index % 2 == 0 ? "bg" : "";
    },
  },
});
</script>
<style lang="scss" scoped>
#album-info {
  position: relative;
  width: 100%;
  height: 220px;
  padding: 10px 20px;
  box-sizing: border-box;
}
#album-data {
  position: relative;
  left: calc(10vw + 20px + 200px);
  top: 0;
  max-width: calc(100vw - 40px - 200px - 10vw);
  overflow: hidden;
  h3 {
    position: relative;
    max-width: 60vw;
    left: 0;
    margin: 0;
    text-align: left;
  }
  #creator-info {
    display: flex;
    max-width: 300px;
    margin: 10px 0;
    line-height: 30px;
    justify-content: left;
    align-items: center;
    #creator-avatar {
      width: 30px;
      height: 30px;
      margin-right: 5px;
      border-radius: 50%;
    }
  }
  #description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    width: 85%;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
  }
}
#img-container {
  position: absolute;
  left: 10%;
  width: 200px;
  height: 200px;
  overflow: hidden;
  box-shadow: 0px 0px 1px 0px lightgray;
  #album-img {
    // width: 150px;
    height: 200px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
#songs {
  ul {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    // margin-bottom: 80px;
    padding: 0px;
    li {
      display: contents;
      list-style: none;
      text-align: left;
      div {
        display: inline-block;
        height: 32px;
        //   border-bottom: 1px solid lightgray;
        line-height: 32px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .title {
        padding-left: 20px;
      }
      .artists > span:not(:last-of-type)::after {
        content: "/";
        margin: 0 2px;
      }
      a {
        color: #2c3e50;
        text-decoration: none;
      }
    }
    li.bg > div {
      background-color: #f8f8f8;
    }
  }
}
</style>