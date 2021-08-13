<template>
  <div id="carousel" :data-animation="animate">
    <div id="carousel-content">
      <ul>
        <li v-for="(item, index) in banner" :key="item" class="carousel-item">
          <div class="img-container">
            <img :src="item.imageUrl" alt="" @click="processJump(index)" />
          </div>
        </li>
      </ul>
    </div>
    <div id="indicator">
      <ul>
        <li
          class="indicator_item"
          v-for="item in banner.length"
          :key="item"
          @click="
            toggleCarousel(item - 1);
            initTimer();
          "
        ></li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import axios from "../axios";
import store from "@/store";

export default defineComponent({
  mounted() {
    //页面加载完一段时间再初始化轮播图，以免轮播图未加载完就执行js导致出错
    setTimeout(() => {
      this.initCarousel();
    }, 1000);
    this.getBanner();
  },
  unmounted() {
    clearInterval(this.carouselTimer);
  },
  data() {
    let banner: Array<any> = [];
    return {
      banner: banner,
      bannerIndex: 0,
      carouselTimer: 0,
      animate: "",
      type: {
        1: "music",
        10: "album",
        100: "artist",
        1000: "playlist",
      },
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
    processJump(index: number) {
      console.log(this.banner[index].targetType);
      console.log(typeof this.banner[index].targetType);
      switch (this.banner[index].targetType) {
        // case 1:
        //   store.commit("changeMusicID", this.banner[index].targetId);
        //   break;
        case 10:
          this.$router.push({ path: "/album/" + this.banner[index].targetId });
          break;
        case 100:
          this.$router.push({ path: "/artist/" + this.banner[index].targetId });
          break;
        default:
          return false;
      }
      // if (this.banner[index].targetType == 1) {
      //   this.$store.commit("changeMusicId",this.banner[index].targetId);
      // }else if(this.type[this.banner[index].targetType]){

      // }
    },
    initTimer() {
      clearInterval(this.carouselTimer);
      this.carouselTimer = window.setInterval(() => {
        this.nextCarousel();
      }, 3500);
    },
    initCarousel() {
      //读取动画类型,若该值不存在则赋值默认值
      this.animate =
        this.$store.state.setting.carouselAnimateType || "traditional";
      this.initTimer();
      //为不同类型的动画做初始化
      switch (this.animate) {
        case "fade":
          let li = document.querySelector("#carousel-content li");
          li!.setAttribute("class", "current");
          break;
        case "pullpushdoor":
          let lis = document.querySelectorAll("#carousel-content li");
          lis[this.banner.length - 1]!.setAttribute("class", "background");
          lis[0].setAttribute("class", "current");
          break;
      }
      let li = document.querySelector("#indicator ul li");
      li!.setAttribute("class", "current");
    },
    toggleCarousel(index: number) {
      this.bannerIndex = index;
      switch (this.animate) {
        case "traditional":
          this.traditionalToogleCarousel(index);
          break;
        case "fade":
          this.fadeToogleCarsousel(index);
          break;
        case "pullpushdoor":
          this.pullpushdoorToogleCarousel(index);
          break;
          defaults: this.traditionalToogleCarousel(index);
      }
      let lis = document.querySelectorAll("#indicator>ul>li");
      for (let i = 0; i < lis.length; i++) {
        lis[i].setAttribute("class", "");
      }
      lis[index].setAttribute("class", "current");
    },
    nextCarousel() {
      if (this.bannerIndex == this.banner.length - 1) {
        this.toggleCarousel(0);
      } else {
        this.toggleCarousel(this.bannerIndex + 1);
      }
    },
    prevCarousel() {
      if (this.bannerIndex == 0) {
        this.toggleCarousel(this.banner.length - 1);
      } else {
        this.toggleCarousel(this.bannerIndex - 1);
      }
    },
    traditionalToogleCarousel(index: number) {
      let picExample = document.querySelector("#carousel-content img");
      let picWidth: number = picExample!.clientWidth;
      let offset = -picWidth * index;
      let ul = <HTMLElement>document.querySelector("#carousel-content ul");
      ul!.style.left = offset + "px";
    },
    fadeToogleCarsousel(index: number) {
      let lis = document.querySelectorAll("#carousel-content ul li");
      lis.forEach((li) => {
        li.setAttribute("class", "");
      });
      lis[index].setAttribute("class", "current");
    },
    pullpushdoorToogleCarousel(index: number) {
      let lis = document.querySelectorAll("#carousel-content ul li");
      //清除原有背景
      let oldBackground = document.querySelector(
        "#carousel-content ul li.background"
      );
      oldBackground!.setAttribute("class", "");
      //将原当前轮播图变成背景
      let background = document.querySelector(
        "#carousel-content ul li.current"
      );
      background!.setAttribute("class", "background");
      lis[index].setAttribute("class", "current");
    },
  },
});
</script>
<style lang="scss" scoped>
#carousel {
  position: relative;
  width: 100%;
  // max-width: 100vw;
  overflow: hidden;
  #carousel-content {
    display: contents;
    ul {
      display: flex;
      position: relative;
      left: 0;
      padding: 0;
      transition-duration: 0.5s;
      transition-timing-function: linear;
      li {
        display: inline-block;
        list-style: none;
        .img-container {
          width: 100%;
          img {
            width: 100vw;
            // width: 100%;
            margin-left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
  #indicator {
    position: absolute;
    width: 100%;
    bottom: 20px;
    text-align: center;
    ul {
      padding: 0;
      li {
        display: inline-block;
        width: 20px;
        height: 8px;
        margin: 0 3px;
        border-radius: 4px;
        background-color: rgba(192, 192, 192, 0.2);
        list-style: none;
        backdrop-filter: blur(10px);
      }
      li.current {
        background-color: #42b984bb;
      }
    }
  }
}
// fade animate style
div[data-animation="fade"] {
  #carousel-content {
    ul {
      // height: 400px;
      width: 100%;
      aspect-ratio: 27/10;
      li {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        transition: 0.5s linear;
      }
      li.current {
        opacity: 1;
      }
    }
  }
}
//pull push door animate style
div[data-animation="pullpushdoor"] {
  #carousel-content {
    ul {
      // height: 400px;
      width: 100%;
      aspect-ratio: 27/10;
      li {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        // margin-left: 50%;
        // transform: translateX(-50%);
        transform: translate3d(100%, 0, 0);
        overflow: hidden;
      }
      li.current {
        left: 0;
        transition: 0.5s linear;
        transform: translate3d(0, 0, 0);
      }
      li.background {
        left: 0;
        z-index: -1;
        transform: translate3d(0, 0, 0);
      }
    }
  }
}
</style>