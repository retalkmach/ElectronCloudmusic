<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/fm">PersonalFM</router-link> |
    <router-link to="/search">Search</router-link> |
    <router-link to="/setting">Setting</router-link> |
    <router-link to="/user">User</router-link>
  </div>
  <!-- <player-full-screen v-if="showPlayer" />
  <router-view v-else :key="$route.fullPath"/> -->
  <router-view :key="$route.fullPath" />
  <player />
</template>

<script>
import player from "@/components/Player.vue";
import store from "@/store";
import PlayerFullScreen from "./views/PlayerFullScreen.vue";

export default {
  name: "app",
  components: {
    player,
    PlayerFullScreen,
  },
  mounted() {
    this.getSetting();
  },
  computed: {
    showPlayer() {
      return this.$store.state.showPlayer;
    },
  },
  methods: {
    getSetting() {
      let setting = {};
      // loading setting
      if (localStorage.getItem("setting") == null) {
        console.log("empty setting, will init setting");
        store.commit("initSetting");
      } else {
        console.log("loading setting");
        setting = JSON.parse(localStorage.getItem("setting"));
        if (setting.version < this.$store.state.defaultSetting.version) {
          store.commit("upgradeSetting");
          return;
        }
        store.commit("changeSetting", setting);
      }
    },
  },
};
</script>

<style src="./assets/style/custom-element.css" />
<style lang="scss">
body,
div,
p {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
}

#nav {
  padding: 25px;

  a {
    font-weight: bold;
    color: var(--text-color);

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

body {
  background-color: var(--background-color);
}

:root {
  --primary-color: #42b983;
  --primary-color-accent: #3da878;
}
#player {
  position: absolute;
  top: 0;
  left: 0;
}
main {
  max-height: calc(100vh - 81px - 68px);
  overflow-y: scroll;
  overflow-x: hidden;
}
a {
  color: var(--text-color);
}
//夜间模式
:root {
  --background-color: white;
  --background-accent-color: #f8f8f8;
  --background-high-elevation-color: white;
  --text-color: #2c3e50;
  --text-secondly-color: #737980;
  --border-color: lightgray;
  --shadow-color: lightgray;
}
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #39403d;
    --background-accent-color: #2d3331;
    --background-high-elevation-color: #555957;
    --text-color: lightgray;
    --text-secondly-color: gray;
    --border-color: black;
    --shadow-color: transparents;
  }
}

//美化播放页滚动条样式
::-webkit-scrollbar {
  width: 10px;
  height: auto;
  background: none;
}
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: #ddddddbb;
  transition: 0.25s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #eeeeeebb;
}
</style>
