<template>
  <main>
    <div id="album-info" v-if="data_loadready">
      <div id="img-container">
        <img :src="playlist_info.coverImgUrl" alt="" id="album-img" />
      </div>
      <div id="album-data">
        <h3 id="album-name">{{ playlist_info.name }}</h3>
        <p id="creator-info">
          <img
            :src="playlist_info.creator.avatarUrl"
            alt=""
            id="creator-avatar"
          />
          <span>{{ playlist_info.creator.nickname }}</span>
        </p>
        <p id="description">
          {{ playlist_info.briefDesc || playlist_info.description }}
        </p>
      </div>
    </div>
    <musicshow :datas="songs" v-if="data_loadready" />
    <div v-else></div>
  </main>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import store from "@/store";
import axios from "../axios";
import musicshow from "@/components/Musicshow.vue";

export default defineComponent({
  setup() {},
  mounted() {
    this.getData();
  },
  components: {
    musicshow,
  },
  data() {
    const songs: Array<any> = [];
    return {
      playlist_info: Object as any,
      songs,
      data_loadready: false,
      // albumData: albumData
    };
  },
  methods: {
    getData() {
      axios
        .post(`/playlist/detail?id=${this.$route.params.playlistID}`, {
          cookie: localStorage.getItem("cookie") || "",
        })
        .then((res) => {
          console.log(res);
          this.songs = res.data.playlist.tracks;
          this.playlist_info = res.data.playlist;
          this.data_loadready = true;
        });
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
</style>
