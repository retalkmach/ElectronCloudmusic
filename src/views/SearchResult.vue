<template>
  <ul v-if="searchResult.length != 1">
    <li v-for="item in searchResult" :key="item" v-on:click="playMusic(item.id)">
      <div class="title">{{ item.name }}</div>
      <div class="artists">
        <span v-for="artist in item.artists" :key="artist"
          >{{ artist.name }}
        </span>
      </div>
      <div class="album">{{ item.album.name }}</div>
    </li>
  </ul>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import axios from "axios";
export default defineComponent({
  created() {
    this.search();  
  },
  data() {
    return {
      searchResult: [Object],
    };
  },
  methods: {
    search() {
      axios
        .get(
          `http://127.0.0.1:5052/search?s=${this.$route.params.keyword}&type=1`
        )
        .then((res) => {
          console.log(res.data.data);
          this.searchResult = res.data.data.result.songs;
        });
    },
    playMusic(id:number){
        this.$store.state.musicID = id;
    }
  },
});
</script>
<style lang="scss" scoped>
ul {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  margin-bottom: 80px;
  li {
    display: contents;
    list-style: none;
    div {
      display: inline-block;
      height: 26px;
      //   border-bottom: 1px solid lightgray;
      line-height: 26px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .artists > span::after {
      content: "/";
      margin: 0 2px;
    }
    .artists > span:last-of-type::after {
      content: none;
    }
  }
}
</style>