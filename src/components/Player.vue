<template>
  <div id="container">
    <audio src="" crossorigin="anonymous"></audio>
    <img
      src="@/assets/images/unknowAlbum.png"
      alt=""
      id="album-pic"
      @click="toggleDisplay"
    />
    <div id="change-playstatus-buttons">
      <button id="prev" @click="playPrevMusic">
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
      <button id="next" @click="playNextMusic">
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
      <el-slider
        id="progress-bar"
        v-model="currentTime"
        :min="0"
        :step="0.5"
        :max="duration"
        :format-tooltip="parseTime"
        @change="DOMArray[3].currentTime = currentTime"
      ></el-slider>
    </div>
    <div id="controller">
      <button id="list" @click="toggleShowPlaylist">
        <img src="../assets/images/bofangliebiao.png" alt="" class="icon" />
      </button>
    </div>
    <div id="playlist" v-if="showPlaylist">
      <h5>播放列表</h5>
      <li
        v-for="(music, index) in playlist"
        :key="music"
        @click="changeMusic(index)"
      >
        {{ music.name }}
        <span class="close" @click="removeMusic(index)"><i class="el-icon-close"></i></span>
      </li>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { defineComponent } from 'vue';
import { Store } from 'vuex';
import store from '@/store';
import axios from '../axios';

export default defineComponent({
  setup() {
    // this.updatePlayedInfo();
  },
  created() {},
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
      duration: 0,
      showPlaylist: false,
      DOMArray: [Object as any],
      artists: [''],
    };
  },
  watch: {
    musicID() {
      this.playMusic();
    },
    currentTime(newTime) {
      this.$store.state.currentTime = newTime;
    },
  },
  methods: {
    playMusic() {
      this.updateMusicInfo();
      this.DOMArray[3].addEventListener('canplay', () => {
        this.DOMArray[3].play();
      });
    },
    changeMusic(index: number) {
      store.commit('changePlaylistCursor', index);
    },
    updateMusicInfo() {
      const id: number = this.musicID;
      // preset played duration
      this.DOMArray[6].innerText = '0:00';
      // update player music address
      axios
        .post(`song/url?id=${id}`, {
          cookie: localStorage.getItem('cookie') || '',
        })
        .then((res) => {
          this.DOMArray[3].setAttribute('src', res.data.data[0].url);
        });
      axios.get(`/song/detail?ids=${id}`).then((res) => {
        const data = res.data.songs[0];
        this.DOMArray[4].innerText = data.name;
        this.artists = [];
        for (const artist of data.ar) {
          this.artists.push(artist.name);
        }
        this.DOMArray[7].innerText = `${Math.floor(
          data.dt / 1000 / 60,
        )}:${this.autoAddZero(Math.ceil((data.dt / 1000) % 60))}`;
        this.DOMArray[9].setAttribute('src', data.al.picUrl);
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
    playNextMusic() {
      this.$store.state.playlistCursor + 1 == this.$store.state.playlist.length
        ? this.changeMusic(0)
        : this.changeMusic(this.$store.state.playlistCursor + 1);
    },
    playPrevMusic() {
      this.$store.state.playlistCursor == 0
        ? this.changeMusic(this.$store.state.playlist.length)
        : this.changeMusic(this.$store.state.playlistCursor - 1);
    },
    removeMusic(index:number){
      store.commit("removeMusicFromPlaylist",index);
    },
    init() {
      const togglePlayStatus = document.querySelector('#toggle-play-status');
      const prev = document.querySelector('#prev');
      const next = document.querySelector('#next');
      const musicPlayer = document.querySelector('audio');
      const musicName = document.querySelector('#music-name');
      const artistName = document.querySelector('#artist-name');
      const playedDuration = document.querySelector('#played-duration');
      const musicDuration = document.querySelector('#music-duration');
      const progressBar = document.querySelector('#progress-bar');
      const albumPic = document.querySelector('#album-pic');
      const playlist = document.querySelector('#playlist');
      // pop old data
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
      this.DOMArray.push(albumPic);
      this.DOMArray.push(playlist);
      // get data
      let duration = 0;
      // add player events
      this.DOMArray[3].addEventListener('durationchange', () => {
        duration = this.DOMArray[3].duration;
        this.duration = duration;
      });
      this.DOMArray[3].addEventListener('timeupdate', () => {
        this.currentTime = this.DOMArray[3].currentTime;
        this.DOMArray[6].innerText = this.parseTime(this.currentTime);
      });
      this.DOMArray[3].addEventListener('pause', () => {
        this.DOMArray[0].className = 'play';
      });
      this.DOMArray[3].addEventListener('play', () => {
        this.DOMArray[0].className = 'pause';
      });
      this.DOMArray[3].addEventListener('ended', () => {
        this.playNextMusic();
      });
    },
    toggleDisplay() {
      this.$store.state.showPlayer = !this.$store.state.showPlayer;
    },
    parseTime(time: number) {
      return `${Math.floor(time / 60)}:${this.autoAddZero(
        Math.floor(time % 60),
      )}`;
    },
    musicFrequency() {
      const audioCtx = new AudioContext();
    },
  },
});
</script>

<style lang="scss" scoped>
$primary-color: #42b983;
$primary-color-hover: #49cc91;
$primary-color-click: #3da878;

#container {
  position: fixed;
  bottom: 0;
  height: 80px;
  width: 100%;
  background-color: white;
  // backdrop-filter: blur(35px);
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
  width: 140px;
  height: 100%;
  // border: 1px solid lightgreen;
  margin-left: 80px;
  justify-content: center;
  align-items: center;
  button {
    width: 32px;
    height: 32px;
    margin: 0 5px;
    padding: 0;
    border-radius: 50%;
    border: none;
    background-color: $primary-color;
    transition: 0.1s;
    .icon {
      width: 32px;
      height: 32px;
      background-color: white;
    }
  }
  button:active {
    // width: 28px;
    // height: 28px;
    // margin: 2px;
    background-color: $primary-color-click;
  }
  button:hover {
    background-color: $primary-color-hover;
  }
  #toggle-play-status {
    position: relative;
    width: 40px;
    height: 40px;
    div {
      // float: left;
      position: absolute;
      top: 0;
      width: 20px;
      height: 40px;
      margin: 0;
      background-color: white;
      transition: 0.1s linear;
    }
    .left{
      position: absolute;
      left: 0;
    }
    .right{
      position: absolute;
      left: 20px;
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
      max-width: calc(100vw - 80px - 140px - 50px - 70px - 50px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
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
    left: 0;
    top: 28px;
    // height: 4px;
    width: 100%;
    // background-color: lightgrey;
    transition: linear 0.25s;
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
  width: 320px;
  max-height: 70vh;
  padding: 2px 5px;
  box-shadow: 1px 1px 2px 1px lightgray;
  border-radius: 2px;
  background-color: white;
  overflow-y: scroll;
  h5 {
    margin: 5px 0;
    text-align: center;
  }
  li {
    // margin: 3px 0;
    overflow: hidden;
    height: 28px;
    line-height: 28px;
    list-style: none;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    .close{
      position: absolute;
      right: 5px;
      color: lightgray;
    }
  }
}
// 按钮样式
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
input[type="range"] {
  height: 24px;
  // -webkit-appearance: none;
  width: 100%;
}
// 媒体查询，适配多种分辨率
@media screen and (max-width: 540px) {
  // #change-playstatus-buttons {
    // #prev,#next{
    //   display: none;
    // }
    // #toggle-play-status{
    //   display: block;
    // }
  // }
  #player-info {
    #music-info {
      // .left {
      //   position: absolute;
      //   left: -150px;
      //   min-width: 100px;
      //   max-width: 200px;
      // }
      .right {
        display: none;
      }
    }
  }
}
@media screen and (min-width: 540px) {
  .el-progress {
    display: none;
  }
}
</style>
