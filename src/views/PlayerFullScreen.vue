<template>
  <div id="background">
    <img src="" alt="" />
  </div>
  <div id="music-info">
    <div id="imgbox">
      <img src="@/assets/images/unknowAlbum.png" alt="" />
    </div>
    <div id="lyric">
      <ul>
        <li v-for="item in lyric" :key="item">{{ item.content }}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { defineComponent, onMounted, onUnmounted } from "vue";
import { Store } from "vuex";
import axios from "axios";
export default defineComponent({
  mounted() {
    this.updateCurrentMusic();
    this.getLyric();
    this.preventScrollLyric();
    // this.debounceSwitchLyric(false);
    //add listener to change lyric
    // document.querySelector("#container>audio")?.addEventListener("play",()=>{
    //   this.debounceSwitchLyric(false);
    // });
    // document.querySelector("#container>input")?.addEventListener("input",()=>{
    //   console.log("test");
    //   this.debounceSwitchLyric(false);
    // });
  },
  data() {
    return {
      lyric: [Object as any],
      rowlyric: Object as any,
      canScrollLyric: true,
      preventScrollTimeout: 0,
    };
  },
  computed: {
    musicID() {
      return this.$store.state.musicID;
    },
    currentTime() {
      return this.$store.state.currentTime;
    },
  },
  watch: {
    musicID() {
      this.updateCurrentMusic();
    },
    currentTime() {
      this.updateLyric();
    },
  },
  methods: {
    updateCurrentMusic() {
      let id = this.musicID;
      axios.get(`http://127.0.0.1:3000/song/detail?ids=${id}`).then((res) => {
        console.log(res);
        let picUrl = res.data.songs[0].al.picUrl;
        let imgbox = document.querySelector("#imgbox>img");
        let backgroundimage = document.querySelector("#background>img");
        imgbox!.setAttribute("src", picUrl);
        backgroundimage!.setAttribute("src", picUrl);
      });
    },
    getLyric() {
      axios
        .get(`http://127.0.0.1:3000/lyric?id=${this.musicID}`)
        .then((res) => {
          console.log(res);
          this.rowlyric = res.data;
          this.progressLyric();
        });
    },
    progressLyric() {
      //check this music is puremusic?
      if (this.rowlyric.nolyric) {
        let obj = { time: 0, content: "纯音乐，请欣赏" };
        this.lyric.push(obj);
        return false;
      }
      let temp: string = this.rowlyric.lrc.lyric;
      let lyricSliced = temp.split("\n");
      for (let i = 0; i < lyricSliced.length; i++) {
        let tempTime = lyricSliced[i].slice(1, lyricSliced[i].indexOf("]"));
        let tempContent = lyricSliced[i].slice(lyricSliced[i].indexOf("]") + 1);
        let tempObj = { time: this.parseTime(tempTime), content: tempContent };
        this.lyric.push(tempObj);
      }
    },
    parseTime(time: string) {
      let mins = parseInt(time.slice(0, time.indexOf(":")));
      let sec = parseInt(time.slice(time.indexOf(":") + 1, time.indexOf(".")));
      let mili = parseInt(time.slice(time.indexOf(".") + 1));
      return mins * 60 + sec + mili * 0.001;
    },
    updateLyric() {
      let time = this.currentTime;
      for (let i = 0; i < this.lyric.length; i++) {
        if (this.lyric[i].time < time && this.lyric[i + 1].time > time) {
          this.switchLyric(i);
          break;
        }
      }
    },
    switchLyric(i: number) {
      let DOMS = document.querySelectorAll("#lyric li");
      DOMS.forEach((DOM) => {
        DOM.className = "";
      });
      DOMS[i].className = "current";
      this.scrollLyric(i);
    },
    scrollLyric(i: number) {
      if (this.canScrollLyric) {
        let DOM = <HTMLElement>document.querySelectorAll("#lyric li")[i];
        let ul = <HTMLElement>document.querySelector("#lyric ul");
        let lyric = document.querySelector("#lyric")!;
        let offset = DOM.offsetTop;
        offset > 200 ? (lyric.scrollTop = offset - 100) : false;
      }
    },
    preventScrollLyric() {
      let lyric = document.querySelector("#lyric")!;
      lyric.addEventListener("scroll", () => {
        this.canScrollLyric = false;
        if (!this.canScrollLyric) {
          clearTimeout(this.preventScrollTimeout);
        }
        this.preventScrollTimeout = window.setTimeout(() => {
          this.canScrollLyric = true;
        }, 3000);
      });
    },
    debounceSwitchLyric(useBinarySearch: boolean) {
      let time = this.currentTime;
      console.log(this.currentTime);
      for (let i = 0; i < this.lyric.length; i++) {
        console.log(this.lyric[i].time);
        if (this.lyric[i].time < time && this.lyric[i + 1].time > time) {
          this.switchLyric(i);
          setTimeout(() => {
            this.debounceSwitchLyric(false);
            console.log(this.lyric[i + 1].time - this.currentTime);
          }, this.lyric[i + 1].time - this.currentTime);
          break;
        }
      }
    },
  },
});
</script>
<style lang="scss" scoped>
#music-info {
  margin: 20px auto;
}
#imgbox {
  display: inline-block;
  width: 45vh;
  height: 45vh;
  margin: 20px;
  box-shadow: 1px 1px 5px 1px lightgray;
  img {
    width: 45vh;
    height: 45vh;
  }
}
#lyric {
  display: inline-block;
  width: 45vh;
  max-height: 45vh;
  overflow: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;
  ul {
    position: relative;
    max-width: 45vh;
    padding: 0;
    scroll-snap-type: y mandatory;
    transition: linear 0.35s;
    li {
      // height: 24px;
      max-width: 45vh;
      margin: 4px 0;
      list-style: none;
      line-height: 22px;
      scroll-snap-align: start;
    }
    li.current {
      color: lightsalmon;
    }
  }
}
#background > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  filter: blur(20px);
}
//美化播放页滚动条样式
::-webkit-scrollbar {
  width: 12px;
  height: auto;
  background: none;
}
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: #dddddd44;
}
</style>