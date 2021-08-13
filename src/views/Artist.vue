<template>
  <main>
    <div id="artist-info" v-if="artistinfo_loadready">
      <div id="img-container">
        <img :src="artist_info.artist.cover" alt="" id="artist-img" />
      </div>
      <div id="artist-data">
        <h3 id="artist-name">{{ artist_info.artist.name }}</h3>
        <p id="description">{{ artist_info.artist.briefDesc }}</p>
      </div>
    </div>
    <datashow :songsData="songs" v-if="songsdata_loadready" />
  </main>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import store from "@/store";
import axios from "../axios";
import datashow from "@/components/Datashow.vue";

export default defineComponent({
  setup() {},
  components: {
    datashow,
  },
  mounted() {
    this.getArtistInfo();
    this.getArtistSongs();
  },
  data() {
    const songs: Array<any> = [];
    return {
      artist_info: Object as any,
      songs,
      artistinfo_loadready: false,
      songsdata_loadready: false,
    };
  },
  computed: {
    artistID() {
      return this.$route.params.artistID;
    },
  },
  watch: {
    artistID() {
      if (this.artistID != undefined) {
        this.getArtistInfo();
        this.getArtistSongs();
      }
    },
  },
  methods: {
    getArtistSongs() {
      axios.get(`/artist/top/song?id=${this.artistID}`).then((res) => {
        console.log(res.data);
        this.songs = res.data.songs;
        this.songsdata_loadready = true;
      });
    },
    getArtistInfo() {
      axios.get(`/artist/detail?id=${this.artistID}`).then((res) => {
        console.log(res.data.data);
        this.artist_info = res.data.data;
        this.artistinfo_loadready = true;
      });
    },
  },
});
</script>
<style lang="scss" scoped>
#artist-info {
  position: relative;
  width: 100%;
  height: 220px;
  padding: 10px 20px;
  box-sizing: border-box;
}
#artist-data {
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
  #description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    width: 85%;
    margin-top: 10px;
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
  #artist-img {
    height: 200px;
    // aspect-ratio: 1/1;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
</style>
