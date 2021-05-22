<template>
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
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import axios from "axios";
export default defineComponent({
  created() {
    this.search();
  },
  mounted() {
    document.addEventListener("scroll", () => {
      console.log(window.scrollY);
    });
  },
  data() {
    return {
      searchResult: [],
      keyword: "",
    };
  },
  methods: {
    search() {
      axios
        .get(
          `http://127.0.0.1:3000/search?keywords=${this.$route.params.keyword}&type=1`
        )
        .then((res) => {
          console.log(res.data);
          this.searchResult = res.data.result.songs;
        });
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
  },
});
</script>
<style lang="scss" scoped>
ul {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  margin-bottom: 80px;
  padding: 0;
  li {
    display: contents;
    list-style: none;
    div {
      display: inline-block;
      height: 32px;
      //   border-bottom: 1px solid lightgray;
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
  background-color: #F8F8F8;
}
a {
  // color: gray;
  color: #2c3e50;
  text-decoration: none;
}
</style>