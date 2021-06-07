<template>
  <main>
    <div id="search-box">
      <input
        type="text"
        v-model="keyword"
        @keyup.enter="updateSearchResult(keyword)"
      />
    </div>
    <ul v-if="searchResult.length != 0">
      <li
        v-for="(item, index) in searchResult"
        :key="item"
        v-bind:class="autoAddClass(index)"
      >
        <div
          class="title"
          v-on:touchend="addPlaylist(index)"
          v-on:dblclick="addPlaylist(index)"
        >
          {{ item.name }}
        </div>
        <div class="artists">
          <span v-for="artist in item.artists" :key="artist">
            <router-link :to="{ path: '/artist/' + artist.id }">{{
              artist.name
            }}</router-link>
          </span>
        </div>
        <div class="album">
          <router-link :to="{ path: '/album/' + item.album.id }">
            {{ item.album.name }}
          </router-link>
        </div>
        <!-- <div class="index">{{autoAddClass(index)}} </div> -->
      </li>
    </ul>
    <div
      id="loading"
      v-loading="true"
      element-loading-background="rgb(255,255,255)"
      style="height: 60px"
    >
      loading
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
import { lchown } from "original-fs";
export default defineComponent({
  created() {
    let page = this.search();
  },
  mounted() {},
  data() {
    const searchResult: Array<any> = [];
    return {
      searchResult: searchResult,
      keyword: "",
    };
  },
  methods: {
    async search() {
      let songCount: number = await this.getData(0);
      let page: number = Math.ceil(songCount / 30);
      let offset = 1;
      let io = new IntersectionObserver(
        (entry) => {
          if (entry[0].intersectionRatio > 0.1) {
            offset += 30;
            this.getData(offset);
            if (offset >= songCount - 30) {
              // io.unobserve(entry[0] as any);
              let loading = document.querySelector("#loading");
              loading!.remove();
              io.disconnect();
            }
          }
        },
        {
          threshold: 1.0,
        }
      );
      if (songCount > 30) {
        io.observe(<HTMLElement>document.querySelector("#loading"));
      } else {
        let loading = document.querySelector("#loading");
        loading!.remove();
        io.disconnect();
      }
    },
    playMusic(id: number) {
      this.$store.state.musicID = id;
    },
    updateSearchResult(keyword: string) {
      router.push({ name: "searchresult", params: { keyword: keyword } });
      this.getData(0);
    },
    autoAddClass(index: number) {
      return index % 2 == 0 ? "bg" : "";
    },
    getData(offset: number): Promise<number> {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `/search?keywords=${this.$route.params.keyword}&type=1&offset=${offset}`
          )
          .then((res) => {
            console.log(res.data);
            // this.searchResult = res.data.result.songs;
            for (let i = 0; i < res.data.result.songs.length; i++) {
              this.searchResult.push(res.data.result.songs[i]);
            }
            let songCount: number = res.data.result.songCount;
            resolve(songCount);
          })
          .catch((err) => {
            console.log(err);
            reject(0);
          });
      });
    },
    addPlaylist(index: number) {
      console.log(index);
      console.log(this.searchResult[index]);
      let artist: Array<string> = [];
      let songData = {
        id: this.searchResult[index].id,
        name: this.searchResult[index].name,
        artist: artist,
      };
      for (let i = 0; i < this.searchResult[index].artists.length; i++) {
        songData.artist.push(this.searchResult[index].artists[i].name);
      }
      store.commit("addPlaylist", songData);
      this.playMusic(this.searchResult[index].id);
    },
  },
});
</script>
<style lang="scss" scoped>
ul {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  margin-top: 20px;
  padding: 0;
  li {
    display: contents;
    list-style: none;
    div {
      display: inline-block;
      height: 32px;
      padding: 0 5px;
      //   border-bottom: 1px solid lightgray;
      text-align: left;
      line-height: 32px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .artists > span:not(:last-of-type)::after {
      content: "/";
      margin: 0 2px;
    }
  }
}
#search-box {
  input {
    width: 256px;
  }
}
.bg > div {
  background-color: #f8f8f8;
}
a {
  // color: gray;
  color: #2c3e50;
  text-decoration: none;
}
</style>