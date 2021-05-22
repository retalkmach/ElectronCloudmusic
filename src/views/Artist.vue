<template>
  <main>
    <div id="artist-info">
      <div id="img-container">
        <img src="" alt="" id="artist-img" />
      </div>
      <h3 id="artist-name"></h3>
      <p id="description">{{ artist_info.artist.briefDesc }}</p>
    </div>
    <div id="songs">
      <ul v-if="songs.length != 0">
        <li
          v-for="(item, index) in songs"
          :key="item"
          v-bind:class="autoAddClass(index)"
        >
          <div class="title" v-on:click="playMusic(item.id)">
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
            {{ item.al.name }}
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import axios from "axios";

export default defineComponent({
  setup() {},
  mounted() {
    this.getArtistInfo();
    this.getArtistSongs();
  },
  data() {
    return {
      artist_info: Object as any,
      songs: Object as any,
    };
  },
  computed: {
    artistID() {
      return this.$route.params.artistID;
    },
  },
  watch: {
    artistID() {
      this.getArtistInfo();
      this.getArtistSongs();
    },
  },
  methods: {
    getArtistSongs() {
      axios
        .get(`http://127.0.0.1:3000/artist/top/song?id=${this.artistID}`)
        .then((res) => {
          console.log(res.data);
          this.songs = res.data.songs;
        });
    },
    getArtistInfo() {
      axios
        .get(`http://127.0.0.1:3000/artist/detail?id=${this.artistID}`)
        .then((res) => {
          console.log(res.data.data);
          this.artist_info = res.data.data;
          document
            .querySelector("#artist-img")!
            .setAttribute("src", this.artist_info.artist.cover);
          document.querySelector(
            "#artist-name"
          )!.innerHTML = this.artist_info.artist.name;
        });
    },
    playMusic(id: number) {
      this.$store.state.musicID = id;
    },
    autoAddClass(index: number) {
      return index % 2 == 0 ? "bg" : "";
    },
  },
});
</script>
<style lang="scss" scoped>
#artist-info {
  position: relative;
  width: 100%;
  height: 200px;
}
#img-container {
  position: absolute;
  left: 15%;
  width: 200px;
  height: 200px;
  overflow: hidden;
  box-shadow: 0px 0px 1px 0px lightgray;
  #artist-img {
    // width: 150px;
    height: 200px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
#description{
  position: absolute;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  left: 45%;
  width: 50%;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
}
#songs {
  ul {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    margin-bottom: 80px;
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
