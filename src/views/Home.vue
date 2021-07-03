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
    <playlistshow
      v-if="recommendPlaylist.length > 0"
      :playlists="recommendPlaylist"
      :rowLimits="2"
    />
  </main>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import store from "@/store";
import playlistshow from "@/components/Playlistshow.vue";
import axios from "../axios";
import carousel from "../components/Carousel.vue";

export default defineComponent({
  mounted() {
    this.getBanner();
    this.getRecommendPlaylist();
  },
  components: {
    carousel,
    playlistshow,
  },
  data() {
    const banner: Array<object> = [];
    const recommendPlaylist: Array<object> = [];
    return {
      banner,
      recommendPlaylist,
    };
  },
  methods: {
    getBanner() {
      axios.get("/banner").then((res) => {
        for (let i = 0; i < res.data.banners.length; i++) {
          this.banner.push(res.data.banners[i]);
        }
      });
    },
    getRecommendPlaylist() {
      axios
        .post("/recommend/resource", {
          cookie: localStorage.getItem("cookie") || "",
        })
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
