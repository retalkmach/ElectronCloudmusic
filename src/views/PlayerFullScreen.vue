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
      lyric: [{ time: "", content: "" }],
      rowlyric: Object as any,
    };
  },
  computed: {
    musicID() {
      return this.$store.state.musicID;
    },
  },
  watch: {
    musicID() {
      this.updateCurrentMusic();
    },
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
        let obj = { time: "0", content: "纯音乐，请欣赏" };
        this.lyric.push(obj);
        return false;
      }
      let temp: string = this.rowlyric.lrc.lyric;
      let lyricSliced = temp.split("\n");
      for (let i = 0; i < lyricSliced.length; i++) {
        let tempTime = lyricSliced[i].slice(0, lyricSliced[i].indexOf("]") + 1);
        let tempContent = lyricSliced[i].slice(lyricSliced[i].indexOf("]") + 1);
        let tempObj = { time: tempTime, content: tempContent };
        this.lyric.push(tempObj);
      }
    },
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
    max-width: 45vh;
    padding: 0;
    li {
      // height: 24px;
      max-width: 45vh;
      margin: 4px 0;
      list-style: none;
      line-height: 22px;
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
</style>