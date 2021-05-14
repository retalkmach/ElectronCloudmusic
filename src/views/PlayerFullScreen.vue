<template>
<div id="background">
  <img src="" alt="">
</div>
  <div id="music-info">
    <div id="imgbox">
      <img src="@/assets/images/unknowAlbum.png" alt="" />
    </div>
    <div id="lyric">
      <ul>
        <li v-for="item in lyric" :key="item">{{ item.content }}</li>
      </ul>
      <p>{{ lyric.content }}</p>
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
  },
  data() {
    return {
      lyric: [Object as any],
      rowlyric: Object as any,
    };
  },
  computed: {
    musicID() {
      return this.$store.state.musicID;
    },
    currentTime(){
      return this.$store.state.currentTime;
    }
  },
  watch: {
    musicID() {
      this.updateCurrentMusic();
    },
    currentTime(){
      this.updateLyric();
    }
  },
  methods: {
    updateCurrentMusic() {
      let id = this.musicID;
      axios.get(`http://127.0.0.1:5052/music_detail?ids=${id}`).then((res) => {
        console.log(res);
        document
          .querySelector("#imgbox>img")
          ?.setAttribute("src", res.data.data.songs[0].al.picUrl);
        document
          .querySelector("#background>img")
          ?.setAttribute("src", res.data.data.songs[0].al.picUrl);
      });
    },
    getLyric() {
      axios
        .get(`http://127.0.0.1:5052/lyric?id=${this.musicID}`)
        .then((res) => {
          console.log(res);
          this.rowlyric = res.data.data;
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
    parseTime(time:string){
      let mins = parseInt(time.slice(0,time.indexOf(":")));
      let sec = parseInt(time.slice(time.indexOf(":")+1,time.indexOf(".")));
      let mili = parseInt(time.slice(time.indexOf(".")+1));
      return mins*60+sec+mili*0.001;
    },
    updateLyric(){
      let time = this.currentTime;
      for(let i=0;i<this.lyric.length;i++){
        if(this.lyric[i].time<time&&this.lyric[i+1].time>time){
          let DOMS = document.querySelectorAll("#lyric li");
          DOMS.forEach(DOM =>{
            DOM.className = "";
          })
          DOMS[i].className = "current";
          this.scrollLyric(i);
          break;
        }
      }      
    },
    scrollLyric(i:number){
      let DOM = <HTMLElement> document.querySelectorAll("#lyric li")[i];
      let ul = <HTMLElement>document.querySelector("#lyric ul");
      let offset = DOM.offsetTop;
      offset>300?ul.style.top = -offset + 100+"px":false;
      // console.log(offset);
      // console.log(ul.scrollTop);
    }
  },
});
</script>
<style lang="scss" scoped>
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
    li.current{
      color: lightsalmon;
    }
  }
}
#background>img{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  filter: blur(15px);
}
//美化播放页滚动条样式
::-webkit-scrollbar{
  width: 12px;
  height: auto;
  background: none;
}
::-webkit-scrollbar-button{
  display: none;
}
::-webkit-scrollbar-thumb{
  border-radius: 6px;
  background-color: #dddddd44;
}
</style>