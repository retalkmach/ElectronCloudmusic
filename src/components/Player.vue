<template>
  <div id="container">
    <audio src=""></audio>
    <router-link to="/playerfullscreen"
      ><img src="@/assets/images/unknowAlbum.png" alt="" id="album-pic"
    /></router-link>
    <div id="change-playstatus-buttons">
      <button id="prev" @click="updateCurrentMusicWithoutPlay">
        <div class="icon"></div>
      </button>
      <button id="toggleplaystatus" class="play" @click="togglePlayStatus">
        <div class="left"></div>
        <div class="right"></div>
      </button>
      <button id="next">
        <div class="icon"></div>
      </button>
    </div>
    <div id="player-info">
      <p id="music-info">
        <span class="left"
          ><span id="music-name"></span> - <span id="artist-name"></span></span
        ><span class="right"
          ><span id="played-duration"></span> / <span id="music-duration"></span
        ></span>
      </p>
      <div id="progress-bar">
        <div id="played-progress-bar"></div>
      </div>
    </div>
    <div id="controller">
      <button id="list" @click="toggleShowPlaylist"><img src="../assets/images/bofangliebiao.png" alt="" class="icon"></button>
    </div>
    <div id="playlist" v-if="showPlaylist">
      <h5>播放列表</h5>
      <li v-for="music in playlist" :key="music">{{music.name}}</li>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import axios from "axios";
// const request = require("@/request")

export default defineComponent({
  setup() {
    // this.updatePlayedProgress();
  },
  mounted() {
    this.updateCurrentMusicWithoutPlay();
  },
  computed: {
    musicID() {
      return this.$store.state.musicID;
    },
    playlist(){
      return this.$store.state.playlist;
    }
  },
  data() {
    return {
      updateProgress: 0,
      showPlaylist:false
    };
  },
  watch: {
    musicID() {
      this.updateCurrentMusic();
    },
  },
  methods: {
    togglePlayStatus() {
      let btn = document.getElementById("toggleplaystatus");
      let audioPlayer = document.querySelector("audio");
      let playStatus = audioPlayer?.paused;
      if (playStatus) {
        btn!.className = "pause";
        audioPlayer!.play();
        this.updatePlayedProgress();
      } else {
        btn!.className = "play";
        audioPlayer?.pause();
        clearInterval(this.updateProgress);
      }
    },
    async updateCurrentMusic() {
      let btn = document.getElementById("toggleplaystatus");
      let audioPlayer = document.querySelector("audio");
      btn!.className = "pause";
      await this.updateCurrentMusicWithoutPlay();
      audioPlayer?.addEventListener("canplay", () => {
        audioPlayer!.play();
        this.updatePlayedProgress();
      });
      //addplaylist
      axios.get(`http://127.0.0.1:5052/music_detail?ids=${this.musicID}`).then(res=>{
        let newMusicInfo = {
          id:this.musicID,
          name: res.data.data.songs[0].name
        }
        this.playlist.push(newMusicInfo);
      })
    },
    async updateCurrentMusicWithoutPlay() {
      let id: number = this.$store.state.musicID;
      axios.get(`http://127.0.0.1:5052/music?id=${id}`).then((res) => {
        console.log(res);
        let musicUrl = res.data.data.data[0].url;
        document.querySelector("audio")?.setAttribute("src", musicUrl);
      });
      axios.get(`http://127.0.0.1:5052/music_detail?ids=${id}`).then((res) => {
        console.log(res);
        let musicDuration = `${Math.floor(
          res.data.data.songs[0].dt / 1000 / 60
        )}:${Math.ceil((res.data.data.songs[0].dt / 1000) % 60)}`;
        document
          .querySelector("#album-pic")
          ?.setAttribute("src", res.data.data.songs[0].al.picUrl);
        document.querySelector("#music-name")!.innerHTML =
          res.data.data.songs[0].name;
        document.querySelector("#artist-name")!.innerHTML =
          res.data.data.songs[0].ar[0].name;
        document.querySelector("#music-duration")!.innerHTML = musicDuration;
        // this.updatePlayedProgress();
        this.resetPlayedProgress();
      });
    },
    updatePlayedProgress() {
      let duration: number;
      let playedProgress = <HTMLElement>(
        document.querySelector("#played-progress-bar")
      );
      let progressBarLength = document.querySelector("#progress-bar")!
        .clientWidth;
      let playedDuration = document.querySelector("#played-duration");
      this.updateProgress = window.setInterval(() => {
        duration = document.querySelector("audio")!.duration;
        //当获取不到正确的音频链接时，会出现定时器异常的问题，通过下面的判断解决该问题
        if (isNaN(duration)) {
          clearInterval(this.updateProgress);
        }
        let currentTime = document.querySelector("audio")!.currentTime;
        let playedProgressLength = (currentTime / duration) * progressBarLength;
        playedProgress!.style.width = playedProgressLength + "px";
        playedDuration!.innerHTML = `${Math.floor(
          currentTime / 60
        )}:${Math.floor(currentTime % 60)}`;
      }, 250);
    },
    resetPlayedProgress() {
      let playedProgress = <HTMLElement>(
        document.querySelector("#played-progress-bar")
      );
      playedProgress.style.width = "0";
      document.querySelector("#played-duration")!.innerHTML = "0:00";
      clearInterval(this.updateProgress);
    },
    toggleShowPlaylist(){
      this.showPlaylist = !this.showPlaylist;
    }
  },
});
</script>

<style lang="scss" scoped>
#container {
  position: fixed;
  bottom: 0;
  height: 80px;
  width: 100%;
  background-color: white;
  border-top: 1px solid lightgray;
}
#album-pic {
  position: absolute;
  left: 0;
  height: 100%;
  aspect-ratio: 1/1;
}
#change-playstatus-buttons {
  display: flex;
  width: 150px;
  height: 100%;
  // border: 1px solid lightgreen;
  margin-left: 80px;
  align-items: center;
  button {
    width: 32px;
    height: 32px;
    margin: 0 5px;
    padding: 0;
    border-radius: 50%;
    border: none;
    background-color: #42b983;
    transition: 0.1s;
    .icon {
      width: 32px;
      height: 32px;
      background-color: white;
    }
  }
  button:active {
    width: 28px;
    height: 28px;
    margin: 2px;
  }
  #toggleplaystatus {
    width: 40px;
    height: 40px;
    div {
      float: left;
      width: 20px;
      height: 40px;
      background-color: white;
      transition: 0.1s linear;
    }
  }
}
#player-info {
  position: absolute;
  top: 10px;
  left: 230px;
  width: calc(100vw - 300px);
  height: 60px;
  #music-info {
    width: 100%;
    .left {
      position: absolute;
      left: 10px;
    }
    .right {
      position: absolute;
      right: 10px;
    }
  }
  #progress-bar {
    position: absolute;
    top: 28px;
    height: 4px;
    width: 100%;
    background-color: lightgrey;
    overflow: hidden;
    #played-progress-bar {
      height: 4px;
      background-color: #42b983;
      transition: 0.25s linear;
    }
  }
}
#controller{
  position: absolute;
  display: flex;
  top: 0;
  right: 0;
  width: 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
  button{
    width: 26px;
    height: 26px;
    background: none;
    border: none;
    .icon{
      width: 26px;
      height: 26px;
    }
  }
}
#playlist{
  position: absolute;
  bottom: 81px;
  right: 0;
  width: 256px;
  padding: 2px 5px;
  box-shadow: 1px 1px 1px 1px lightgray;
  border-radius: 2px;
  background-color: white;
  h5{
    margin: 5px 0;
    text-align: center;
  }
  li{
    margin: 3px 0;
    list-style: none;
    text-align: left;
  }
}
#toggleplaystatus.play {
  .left {
    clip-path: polygon(50% 25%, 100% 40%, 100% 60%, 50% 75%);
  }
  .right {
    clip-path: polygon(0 40%, 50% 50%, 50% 50%, 0 60%);
  }
}
#toggleplaystatus.pause {
  .left {
    clip-path: polygon(50% 25%, 80% 25%, 80% 75%, 50% 75%);
  }
  .right {
    clip-path: polygon(20% 25%, 50% 25%, 50% 75%, 20% 75%);
  }
}
#prev > .icon {
  clip-path: polygon(
    30% 25%,
    40% 25%,
    40% 50%,
    70% 25%,
    70% 75%,
    40% 50%,
    40% 75%,
    30% 75%
  );
}
#next > .icon {
  clip-path: polygon(
    70% 25%,
    60% 25%,
    60% 50%,
    30% 25%,
    30% 75%,
    60% 50%,
    60% 75%,
    70% 75%
  );
}
#list>.icon{
  clip-path: polygon(10% 25%,90% 25%,90% 35%, 10% 35%, 10);
}
</style>
