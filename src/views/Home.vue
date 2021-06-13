<template>
  <main>
    <div class="home">
      <carousel />
      <el-carousel
        :interval="5000"
        style="height: calc(100vw / 2.7)"
        arrow="always"
        v-if="false"
      >
        <el-carousel-item v-for="item in banner" :key="item">
          <img :src="item.imageUrl" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div id="recommend-playlist" v-if="recommendPlaylist.length > 0">
      <div class="card" v-for="playlist in recommendPlaylist" :key="playlist">
        <router-link
          :to="{
            name: 'playlist',
            params: { playlistID: playlist.id },
          }"
        >
          <div class="img-container">
            <img :src="playlist.picUrl" alt="" />
          </div>
          <span>{{ playlist.name }}</span>
        </router-link>
      </div>
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
import carousel from "../components/Carousel.vue"

export default defineComponent({
  mounted() {
    this.getBanner();
    this.getRecommendPlaylist();
  },
  components:{
    carousel
  },
  data() {
    let banner: Array<object> = [];
    let recommendPlaylist: Array<object> = [];
    return {
      banner: banner,
      recommendPlaylist: recommendPlaylist,
    };
  },
  methods: {
    getBanner() {
      axios.get("/banner").then((res) => {
        for (let i = 0; i < res.data.banners.length; i++) {
          this.banner.push(res.data.banners[i]);
        }
        console.log(res);
        console.log(this.banner);
      });
    },
    getRecommendPlaylist() {
      axios
        .post("/recommend/resource", { cookie: localStorage.getItem("cookie")||"" })
        .then((res) => {
          console.log(res);
          for (let i = 0; i < res.data.recommend.length; i++) {
            this.recommendPlaylist.push(res.data.recommend[i]);
          }
        });
    },
  },
});
</script>
<style lang="scss" scoped>
.el-carousel__item {
  width: 100%;
  height: calc(100vw / 2.7);
  img {
    width: 100%;
    aspect-ratio: 27/10;
  }
}
#recommend-playlist {
  display: grid;
  height: 500px;
  margin: 20px auto;
  overflow: hidden;
  grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
  grid-auto-flow: row;
  grid-gap: minmax(0,10px);
  justify-content: center;
  justify-items: center;
  grid-template-rows: 1fr 1fr;
}
.card {
  display: inline-block;
  width: 220px;
  // height: 280px;
  margin: 5px 0;
  .img-container {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    img {
      width: 200px;
      height: 200px;
    }
  }
  span {
    display: -webkit-inline-box;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
  }
}
</style>