<template>
  <main>
    <searchBar />
    <el-radio-group v-model="type">
      <el-radio-button label="song">音乐</el-radio-button>
      <el-radio-button label="album">专辑</el-radio-button>
      <el-radio-button label="artist">歌手</el-radio-button>
      <el-radio-button label="playlist">歌单</el-radio-button>
    </el-radio-group>
    <component :is="currentComponent" :datas="searchResult" :type="type" v-if="searchResult.length" />
    <div
      id="loading"
      v-if="hasMore"
      v-loading="hasMore"
      element-loading-background="rgba(0,0,0,0)"
      style="height: 60px"
      ref="loading"
    ></div>
  </main>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import { Store } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useIntersectionObserver } from "@vueuse/core";
import axios from "../axios";
import store from "@/store";
import searchBar from "@/components/SearchBar.vue";
import musicshow from "@/components/Musicshow.vue";
import dataShow from "@/components/DataShow.vue";

const router = useRouter();
const route = useRoute();
let searchResult: Array<any> = reactive([]);
let keywords = route.params.keyword;
let laodedCount = 0;
let inputContent: string = "";
let loading = ref(null);
let hasMore = ref(true);
let type = ref("song");

enum searchType {
  song = 1,
  album = 10,
  artist = 100,
  playlist = 1000,
  user = 1002,
  mv = 1004,
  lyric = 1006,
  dj = 1009,
  video = 1014
}

let typeName = {
  song: "单曲",
  album: "专辑",
  artist: "歌手",
  playlist: "歌单",
  user: "用户",
  mv: "MV",
  lyric: "歌词",
  dj: "电台",
  video: "视频"
}

let currentComponent = computed(()=>{
  if(type.value ==="song"){
    return musicshow;
  }else{
    return dataShow;
  }
});

//当页面滑动到接近底部，触发加载事件
const { stop } = useIntersectionObserver(loading, ([{ isIntersecting }], observerElement) => {
  search();
}, { rootMargin: '300px' })

function search() {
  axios.get(`/search?keywords=${keywords}&offset=${laodedCount}&type=${searchType[type.value]}`).then((res) => {
    hasMore.value = res.data.result.hasMore;
    console.log(res.data);
    for (let data of res.data.result[type.value + "s"]) {
      searchResult.push(data);
    }
    if (!hasMore.value) {
      stop();
    }
  });
  laodedCount += 30;
}

watch(type, () => {
  while (searchResult.length) {
    searchResult.pop();
  }
  laodedCount = 0;
  search();
})

search();
</script>
<style lang="scss" scoped>
a {
  // color: gray;
  color: var(--text-secondly-color);
  text-decoration: none;
}
</style>