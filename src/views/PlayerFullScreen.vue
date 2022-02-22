<template>
  <div id="background" v-if="setting.usePicAsPlayerBackground">
    <img src />
  </div>
  <canvas id="frequency" :height="layoutData.lyricHeight / 0.4" :width="layoutData.windowWidth"></canvas>
  <div id="music-info">
    <div id="info">
      <p id="name">{{ musicInfo.name }}</p>
      <p>
        <span class="artists">
          <router-link
            :to="'/artist/' + artist.id"
            class="artist"
            v-for="artist in musicInfo.artists"
            :key="artist.name"
          >{{ artist.name }}</router-link>
        </span>
        <span class="delimiter">-</span>
        <span class="album">
          <router-link :to="'/album/' + musicInfo.album.id">
            {{
              musicInfo.album.name
            }}
          </router-link>
        </span>
      </p>
    </div>
    <div id="imgbox">
      <img src="@/assets/images/unknowAlbum.png" alt />
    </div>
    <div id="lyric">
      <ul>
        <li v-for="item in lyric" :key="item">
          {{ item.content }}
          <span class="translated-lyric">
            <br />
            {{ item.transContent || "" }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { defineComponent, onMounted, onUnmounted } from "vue";
import axios from "../axios";
export default defineComponent({
  mounted() {
    this.updateCurrentMusic();
    this.getLyric();
    this.preventScrollLyric();
    this.initMusicAnalyser();
    //获取布局信息
    let lyric = <HTMLElement>document.querySelector("#lyric");
    this.layoutData.lyricHeight = lyric.offsetWidth;
    this.layoutData.windowWidth = document.body.offsetWidth;
    this.layoutData.gutter = (this.layoutData.windowWidth - this.audioDataArr.length * 5) / this.audioDataArr.length;
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
  beforeUnmount() {
    // window.cancelAnimationFrame(this.animation);
    window.clearInterval(this.animation);
  },
  data() {
    let audioDataArr: Uint8Array = new Uint8Array(this.$store.state.setting.visualization.frequencyAnalyserAccuracy / 2);
    let lyric: Array<any> = [];
    let artist = { name: String, id: Number };
    let musicInfo = {
      artists: [artist],
      album: { name: String, id: Number },
      name: String,
    };
    let layoutData = {
      lyricHeight: 0,
      windowWidth: 0,
      gutter: 0
    };
    return {
      lyric: lyric,
      rowlyric: Object as any,
      translatedLyric: [Object as any],
      currentLyricIndex: 0,
      canScrollLyric: true,
      preventScrollTimeout: 0,
      audioDataArr: audioDataArr,
      animation: 0,
      musicInfo: musicInfo,
      layoutData: layoutData,
    };
  },
  computed: {
    musicID() {
      return this.$store.state.musicID;
    },
    currentTime() {
      return this.$store.state.currentTime;
    },
    setting() {
      return this.$store.state.setting;
    },
  },
  watch: {
    musicID() {
      this.updateCurrentMusic();
      this.getLyric();
      //将歌词调整到初始状态
      let lyric = <HTMLElement>document.querySelector("#lyric");
      lyric.scrollTop = 0;
    },
    currentTime() {
      this.updateLyric();
    },
  },
  methods: {
    updateCurrentMusic() {
      let id = this.musicID;
      axios.get(`/song/detail?ids=${id}`).then((res) => {
        console.log(res);
        let picUrl = res.data.songs[0].al.picUrl;
        let imgbox = document.querySelector("#imgbox>img");
        let backgroundimage = document.querySelector("#background>img");
        imgbox!.setAttribute("src", picUrl);
        this.musicInfo.album.name = res.data.songs[0].al.name;
        this.musicInfo.album.id = res.data.songs[0].al.id;
        this.musicInfo.name = res.data.songs[0].name;
        //清空原有歌手信息
        while (this.musicInfo.artists.length) {
          this.musicInfo.artists.pop();
        }
        for (let i = 0; i < res.data.songs[0].ar.length; i++) {
          let artist = {
            name: res.data.songs[0].ar[i].name,
            id: res.data.songs[0].ar[i].id,
          };
          this.musicInfo.artists.push(artist);
        }
        if (this.setting.usePicAsPlayerBackground == true) {
          backgroundimage!.setAttribute("src", picUrl);
        }
      });
    },
    getLyric() {
      axios.get(`/lyric?id=${this.musicID}`).then((res) => {
        console.log(res);
        this.rowlyric = res.data;
        this.progressLyric();
      });
    },
    progressLyric() {
      //clear origin data
      this.lyric = [];
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
        let tempObj: any = {
          time: this.parseTime(tempTime),
          content: tempContent,
        };
        this.lyric.push(tempObj);
      }
      if (this.setting.showTranslatedLyric) {
        this.processTranslatedLyric();
      }
    },
    processTranslatedLyric() {
      if (this.rowlyric.tlyric.lyric == "") {
        return false;
      }
      let transLyricSliced = this.rowlyric.tlyric.lyric.split("\n");
      let lyricIndex = 0;
      let lyricMaxIndex = this.lyric.length - 1;
      for (let i = 1; i < transLyricSliced.length; i++) {
        let time = this.parseTime(
          transLyricSliced[i].slice(1, transLyricSliced[i].indexOf("]"))
        );
        let transLyric = transLyricSliced[i].slice(
          transLyricSliced[i].indexOf("]") + 1
        );
        for (; lyricIndex <= lyricMaxIndex; lyricIndex++) {
          if (time == this.lyric[lyricIndex].time) {
            this.lyric[lyricIndex] = {
              ...this.lyric[lyricIndex],
              transContent: transLyric,
            };
            break;
          }
        }
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
      let lyricIndex = 0;
      for (let i = 0; i < this.lyric.length; i++) {
        if (i == this.lyric.length - 1) {
          //部分歌曲最后一句歌词内容空白且时间为NaN,导致显示最后一句歌词时显示异常
          if (isNaN(this.lyric[i].time)) {
            lyricIndex = i - 1;
          } else {
            lyricIndex = i;
          }
          break;
        }
        if (this.lyric[i].time <= time && this.lyric[i + 1].time >= time) {
          lyricIndex = i;
          break;
        }
      }
      if (lyricIndex != this.currentLyricIndex) {
        this.currentLyricIndex = lyricIndex;
        this.switchLyric(this.currentLyricIndex);
      }
    },
    switchLyric(i: number) {
      let DOMS = document.querySelectorAll("#lyric li");
      DOMS.forEach((DOM) => {
        DOM.className = "";
      });
      if (DOMS.length == 0) {
        return false;
      }
      DOMS[i].className = "current";
      this.scrollLyric(i);
    },
    scrollLyric(i: number) {
      if (this.canScrollLyric) {
        let DOM = <HTMLElement>document.querySelectorAll("#lyric li")[i];
        let ul = <HTMLElement>document.querySelector("#lyric ul");
        let lyric = document.querySelector("#lyric")!;
        let offset = DOM.offsetTop;
        offset > this.layoutData.lyricHeight / 2
          ? (lyric.scrollTo({ top: offset - this.layoutData.lyricHeight / 2 + 30, behavior: "smooth" }))
          : false;
        // DOM.scrollIntoView({block:"center",behavior:"smooth"});
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
    initMusicAnalyser() {
      if (this.setting.visualization.showFrequency == false) {
        return false;
      }
      if (!this.$store.state.initedAudioContext) {
        this.$store.state.audioContext = new AudioContext();
        let audio = document.querySelector("audio")!;
        this.$store.state.initedAudioContext = true;
        this.$store.state.audioSource =
          this.$store.state.audioContext.createMediaElementSource(audio);
        this.$store.state.musicAnalyser =
          this.$store.state.audioContext.createAnalyser();
        this.$store.state.audioSource.connect(this.$store.state.musicAnalyser);
        this.$store.state.musicAnalyser.connect(
          this.$store.state.audioContext.destination
        );
      }
      this.$store.state.musicAnalyser.fftSize = this.setting.visualization.frequencyAnalyserAccuracy;
      console.log(this.$store.state.musicAnalyser)
      this.animation = window.setInterval(() => {
        this.freshMusicFrequency();
      }, 16.6);
    },
    freshMusicFrequency() {
      let frequency = <HTMLCanvasElement>document.querySelector("#frequency")!;
      let ctx = frequency.getContext("2d")!;
      ctx.fillStyle = "lightskyblue";
      ctx.strokeStyle = "lightskyblue";
      ctx.lineWidth = 2;
      this.$store.state.musicAnalyser.getByteFrequencyData(this.audioDataArr);
      let data = this.audioDataArr;
      let height = this.layoutData.lyricHeight / 0.4;
      ctx.clearRect(0, 0, this.layoutData.windowWidth, height);
      switch (this.setting.visualization.animationType) {
        case "Bar chart":
          let startcoo = -5;
          for (let i = 0; i < data.length; i++) {
            startcoo += 5 + this.layoutData.gutter
            ctx.fillRect(startcoo, height, 5, -1 * data[i]);
          };
          break;
        case "line chart":
          ctx.beginPath();
          ctx.moveTo(0,(height - data[0]));
          let coordinatex = 0;
          for (let i = 0; i < data.length; i++) {
            coordinatex += 5 + this.layoutData.gutter;
            ctx.lineTo(coordinatex,(height - data[i]));
          };
          ctx.stroke();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
#music-info {
  margin: 20px auto;
}
#info {
  height: 60px;
  p {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #name {
    font-weight: 500;
    font-size: 1.5em;
  }
  :not(#name) {
    color: var(--text-secondly-color);
  }
  .artist:not(:last-child)::after {
    content: "/";
    margin: 0 2px;
    color: var(--text-delimiter-color);
  }
  .delimiter {
    margin: 0 8px;
    color: var(--text-delimiter-color) !important;
  }
}
#imgbox {
  display: inline-block;
  width: 45vh;
  height: 45vh;
  margin: 20px;
  box-shadow: 1px 1px 5px 1px var(--shadow-color);
  img {
    width: 45vh;
    height: 45vh;
  }
}
#lyric {
  display: inline-block;
  width: 45vh;
  height: 45vh;
  overflow-y: scroll;
  overflow-x: hidden;
  // scroll-behavior: smooth;
  ul {
    position: relative;
    max-width: 45vh;
    margin: 0;
    padding: 0;
    scroll-snap-type: y mandatory;
    transition: linear 0.35s;
    vertical-align: middle;
    li {
      // height: 24px;
      max-width: 45vh;
      margin: 4px 0;
      list-style: none;
      line-height: 22px;
      scroll-snap-align: start;
      transition: 0.1s linear;
      .translated-lyric {
        margin-top: 2px;
        font-size: 14px;
      }
    }
    li.current {
      color: lightsalmon;
      font-size: 18px;
      .translated-lyric {
        font-size: 16px;
      }
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
  opacity: 0.25;
}
#frequency {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 80px);
  overflow: hidden;
  z-index: -1;
}
</style>