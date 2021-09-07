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
    this.isBigScreen = document.body.clientWidth > 1024 ? true : false;
    window.addEventListener("resize", () => {
      this.isBigScreen = document.body.clientWidth > 1024 ? true : false;
    });
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
      isBigScreen: false,
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
      }, 5000);
    },
    initCarousel() {
      //读取动画类型,若该值不存在则赋值默认值
      this.animate =
        this.$store.state.setting.carouselAnimateType || "traditional";
      this.initTimer();
      if (!this.isBigScreen) {
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
      } else {
        this.toggleCarousel(0);
      }
      let li = document.querySelector("#indicator ul li");
      li!.setAttribute("class", "current");
    },
    toggleCarousel(index: number) {
      let oldIndex = this.bannerIndex;
      this.bannerIndex = index;
      if (!this.isBigScreen) {
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
      } else {
        this.bigScreenToogleCarousel(index, oldIndex);
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
    bigScreenToogleCarousel(index: number, oldIndex: number) {
      let lis = document.querySelectorAll("#carousel-content ul li");
      let prevIndex = index == 0 ? lis.length - 1 : index - 1;
      let nextIndex = index == lis.length - 1 ? 0 : index + 1;
      let abandonedIndex = prevIndex == 0 ? lis.length - 1 : prevIndex - 1;
      lis.forEach((li) => {
        li.setAttribute("class", "");
      });
      lis[prevIndex].setAttribute("class", "prev");
      lis[index].setAttribute("class", "current");
      lis[nextIndex].setAttribute("class", "next");
      lis[abandonedIndex].setAttribute("class", "abandoned");
      if (oldIndex != lis.length - 1 && oldIndex > index) {
        lis[abandonedIndex].setAttribute("class", "");
        abandonedIndex = nextIndex == lis.length - 1 ? 0 : nextIndex + 1;
        lis[prevIndex].classList.add("reverse");
        lis[index].classList.add("reverse");
        lis[nextIndex].classList.add("reverse");
        lis[abandonedIndex].setAttribute("class", "abandoned");
        lis[abandonedIndex].classList.add("reverse");
      }
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
@media (max-width: 1024px) {
  #carousel-content {
    ul {
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
        }
        li.background {
          left: 0;
          z-index: -1;
        }
      }
    }
  }
}
//大屏幕下轮播图动画以及布局
@media (min-width: 1024px) {
  #carousel-content {
    ul {
      display: inline-block;
      width: 100%;
      height: 420px;
      // justify-content: center;
      li {
        display: none;
        transition: 1.25s linear;
      }
      li.current {
        position: absolute;
        display: inline-block;
        width: 1080px;
        left: calc((100vw - 1080px) / 2);
        object-fit: contain;
        animation: animate-current-positive 0.75s linear;
      }
      li.prev,
      li.next,
      li.abandoned {
        position: absolute;
        display: inline-block;
        height: 300px;
        aspect-ratio: 27/10;
        top: 50px;
        filter: brightness(0.4);
        z-index: -1;
        img {
          width: 100%;
        }
      }
      li.prev {
        left: 0;
        animation: animate-prev-positive 0.75s linear;
      }
      li.next {
        right: 0;
        animation: animate-next-positive 0.75s linear;
      }
      li.abandoned {
        animation: animate-abandoned-positive 0.75s linear;
      }
      li.current.reverse {
        animation: animate-current-reverse 0.75s linear;
      }
      li.next.reverse {
        animation: animate-next-reverse 0.75s linear;
        z-index: -2;
      }
      li.prev.reverse {
        animation: animate-prev-reverse 0.75s linear;
      }
      li.abandoned.reverse{
        animation: animate-abandoned-reverse 0.75s linear;
        z-index: -2;
      }
      //正向移动动画
      @keyframes animate-next-positive {
        0% {
          right: -500px;
        }
        100% {
          right: 0;
        }
      }
      @keyframes animate-prev-positive {
        0% {
          width: 1080px;
          top: 0;
          left: calc((100vw - 1080px) / 2);
        }
        100% {
          width: 810px;
          left: 0;
        }
      }
      @keyframes animate-current-positive {
        0% {
          width: 810px;
          left: calc(100vw - 810px);
        }
        100% {
          width: 1080px;
          left: calc((100vw - 1080px) / 2);
        }
      }
      @keyframes animate-abandoned-positive {
        0% {
          top: 50px;
          left: 0;
        }
        100% {
          top: 100px;
          height: 200px;
          left: -540px;
        }
      }
      //反向移动动画
      @keyframes animate-next-reverse {
        0% {
          top: 0;
          width: 1080px;
          left: calc((100vw - 1080px) / 2);
        }
        100% {
          width: 810px;
          left: calc(100vw - 810px);
        }
      }
      @keyframes animate-prev-reverse {
        0% {
          left: -810px;
        }
        100% {
          left: 0;
        }
      }
      @keyframes animate-current-reverse {
        0% {
          width: 810px;
          left: 0;
        }
        100% {
          width: 1080px;
          left: calc((100vw - 1080px) / 2);
        }
      }
      @keyframes animate-abandoned-reverse {
        0% {
          top: 50px;
          left: calc(100vw - 810px);
        }
        100% {
          top: 100px;
          height: 200px;
          left: 100vw;
        }
      }
    }
  }
}
</style>