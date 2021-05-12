<template>
  <div id="container">
    <audio src=""></audio>
    <router-link to="/playerfullscreen"
      ><img src="@/assets/images/unknowAlbum.png" alt="" id="album-pic"
    /></router-link>
    <div id="change-playstatus-buttons">
      <button id="prev" @click="updateMusicInfo">
        <div class="icon"></div>
      </button>
      <button
        id="toggle-play-status"
        class="play"
        @click="DOMArray[3].paused ? play() : pause()"
      >
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
          ><span id="music-name"></span> -
          <span id="artist-name"
            ><span v-for="artist in artists" :key="artist">{{ artist }} </span>
          </span></span
        ><span class="right"
          ><span id="played-duration"></span> / <span id="music-duration"></span
        ></span>
      </p>
      <div id="progress-bar">
        <div id="played-progress-bar"></div>
      </div>
    </div>
    <div id="controller">
      <button id="list" @click="toggleShowPlaylist">
        <img src="../assets/images/bofangliebiao.png" alt="" class="icon" />
      </button>
    </div>
    <div id="playlist" v-if="showPlaylist">
      <h5>播放列表</h5>
      <li v-for="music in playlist" :key="music">{{ music.name }}</li>
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
    // this.updatePlayedInfo();
  },
  mounted() {
    this.init();
    this.updateMusicInfo();
  },
  computed: {
    musicID() {
      return this.$store.state.musicID;
    },
    playlist() {
      return this.$store.state.playlist;
    },
  },
  data() {
    return {
      updateProgressInterval: 0,
      updatePlayedDurationInterval: 2,
      currentTime: 0,
      showPlaylist: false,
      DOMArray: [Object as any],
      artists: [""],
    };
  },
  watch: {
    musicID() {
      this.playMusic();
    },
  },
  methods: {
    playMusic() {
      this.updateMusicInfo();
      this.DOMArray[3].addEventListener("canplay", () => {
        this.DOMArray[3].play();
      });
    },
    updateMusicInfo() {
      let id: number = this.musicID;
      //preset played duration
      this.DOMArray[6].innerText = "0:00";
      //update player music address
      axios.get(`http://127.0.0.1:5052/music?id=${id}`).then((res) => {
        this.DOMArray[3].setAttribute("src", res.data.data.data[0].url);
      });
      axios.get(`http://127.0.0.1:5052/music_detail?ids=${id}`).then((res) => {
        let data = res.data.data.songs[0];
        this.DOMArray[4].innerText = data.name;
        this.artists = [];
        for (let artist of data.ar) {
          this.artists.push(artist.name);
        }
        this.DOMArray[7].innerText = `${Math.floor(
          data.dt / 1000 / 60
        )}:${this.autoAddZero(Math.ceil((data.dt / 1000) % 60))}`;
        this.DOMArray[10].setAttribute("src", data.al.picUrl);
      });
    },
    toggleShowPlaylist() {
      this.showPlaylist = !this.showPlaylist;
    },
    autoAddZero(num: number) {
      return num > 9 ? num : `0${num}`;
    },
    play() {
      this.DOMArray[3].play();
    },
    pause() {
      this.DOMArray[3].pause();
    },
    init() {
      let togglePlayStatus = document.querySelector("#toggle-play-status");
      let prev = document.querySelector("#prev");
      let next = document.querySelector("#next");
      let musicPlayer = document.querySelector("audio");
      let musicName = document.querySelector("#music-name");
      let artistName = document.querySelector("#artist-name");
      let playedDuration = document.querySelector("#played-duration");
      let musicDuration = document.querySelector("#music-duration");
      let progressBar = document.querySelector("#progress-bar");
      let playedProgress = document.querySelector("#played-progress-bar");
      let albumPic = document.querySelector("#album-pic");
      let playlist = document.querySelector("#playlist");
      //pop old data
      this.DOMArray.pop();
      // push DOM object
      this.DOMArray.push(togglePlayStatus);
      this.DOMArray.push(prev);
      this.DOMArray.push(next);
      this.DOMArray.push(musicPlayer);
      this.DOMArray.push(musicName);
      this.DOMArray.push(artistName);
      this.DOMArray.push(playedDuration);
      this.DOMArray.push(musicDuration);
      this.DOMArray.push(progressBar);
      this.DOMArray.push(playedProgress);
      this.DOMArray.push(albumPic);
      this.DOMArray.push(playlist);
      //check this function
      console.log(this.DOMArray);
      //get data
      let duration: number = 0;
      let progressBarLength = this.DOMArray[8].clientWidth;
      window.addEventListener("resize", () => {
        progressBarLength = this.DOMArray[8].clientWidth;
      });
      //add player events
      this.DOMArray[3].addEventListener("durationchange", () => {
        duration = this.DOMArray[3].duration;
      });
      this.DOMArray[3].addEventListener("timeupdate", () => {
        this.currentTime = this.DOMArray[3].currentTime;
        this.DOMArray[6].innerText = `${Math.floor(
          this.currentTime / 60
        )}:${this.autoAddZero(Math.ceil(this.currentTime % 60))}`;
        this.DOMArray[9].style.width =
          (this.currentTime / duration) * progressBarLength + "px";
      });
      this.DOMArray[3].addEventListener("pause", () => {
        this.DOMArray[0].className = "play";
      });
      this.DOMArray[3].addEventListener("play", () => {
        this.DOMArray[0].className = "pause";
      });
      // this.DOMArray[3].addEventListener("canplay", () => {
      //   console.log("can play");
      // });
      this.DOMArray[3].addEventListener("ended", () => {});
    },
  },
});
</script>

<style lang="scss" scoped>
#container {
  position: fixed;
  bottom: 0;
  height: 80px;
  width: 100%;
  // background-color: white;
  backdrop-filter: blur(35px);
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
  #toggle-play-status {
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
      left: 5px;
      span{
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #artist-name {
        color: gray;
        span:not(:last-of-type)::after {
          content: "/";
          margin: 0 2px;
        }
      }
    }
    .right {
      position: absolute;
      right: 5px;
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
#controller {
  position: absolute;
  display: flex;
  top: 0;
  right: 0;
  width: 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
  button {
    width: 26px;
    height: 26px;
    background: none;
    border: none;
    .icon {
      width: 26px;
      height: 26px;
    }
  }
}
#playlist {
  position: absolute;
  bottom: 81px;
  right: 0;
  width: 256px;
  padding: 2px 5px;
  box-shadow: 1px 1px 1px 1px lightgray;
  border-radius: 2px;
  background-color: white;
  h5 {
    margin: 5px 0;
    text-align: center;
  }
  li {
    margin: 3px 0;
    list-style: none;
    text-align: left;
  }
}
#toggle-play-status.play {
  .left {
    clip-path: polygon(50% 25%, 100% 40%, 100% 60%, 50% 75%);
  }
  .right {
    clip-path: polygon(0 40%, 50% 50%, 50% 50%, 0 60%);
  }
}
#toggle-play-status.pause {
  .left {
    clip-path: polygon(50% 25%, 80% 25%, 80% 75%, 50% 75%);
  }
  .right {
    clip-path: polygon(20% 25%, 50% 25%, 50% 75%, 20% 75%);
  }
}
#toggle-play-status.cache {
  background-image: url(../assets/images/loading.png);
  animation: rotate 3s linear infinite;
  .left {
    display: none;
  }
  .right {
    display: none;
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
#list > .icon {
  clip-path: polygon(10% 25%, 90% 25%, 90% 35%, 10% 35%, 10);
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
