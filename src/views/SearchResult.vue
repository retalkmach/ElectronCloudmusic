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
        <div class="title" v-on:click="playMusic(item.id)">
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
          {{ item.album.name }}
        </div>
        <!-- <div class="index">{{autoAddClass(index)}} </div> -->
      </li>
    </ul>
    <div id="loading">loadding</div>
  </main>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import axios from "axios";
export default defineComponent({
  created() {
    let page = this.search();
  },
  mounted() {},
  data() {
    const searchResult: Array<object> = [];
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
              document.querySelector("#loading")?.remove();
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
        document.querySelector("#loading")?.remove();
        io.disconnect();
      }
    },
    playMusic(id: number) {
      this.$store.state.musicID = id;
    },
    updateSearchResult(keyword: string) {
      router.push({ name: "searchresult", params: { keyword: keyword } });
      this.search();
    },
    autoAddClass(index: number) {
      return index % 2 == 0 ? "bg" : "";
    },
    getData(offset: number): Promise<number> {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `http://127.0.0.1:3000/search?keywords=${this.$route.params.keyword}&type=1&offset=${offset}`
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
  },
});
</script>
<style lang="scss" scoped>
ul {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  margin: 0;
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