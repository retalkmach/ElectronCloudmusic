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
  <router-view />
  <player />
</template>

<script>
import player from "@/components/Player.vue";
import store from "@/store";
import PlayerFullScreen from "./views/PlayerFullScreen.vue";
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import { ref } from "vue";

export default {
  name: "app",
  setup() {
    let setting = {};
    let systemPerferDarkMde;
    let darkmode;
    //get setting
    function getSetting() {
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
    }
    if (localStorage.getItem("setting") != null) {
      setting = JSON.parse(localStorage.getItem("setting"));
    }
    function updateDarkModeStatus() {
      systemPerferDarkMde =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (store.state.setting.appearance) {
        darkmode =
          store.state.setting.appearance.autoToogleDarkMode &&
          systemPerferDarkMde;
      } else {
        darkmode = setting.appearance.autoToogleDarkMode && systemPerferDarkMde;
      }
      document.querySelector("body").setAttribute("data-darkmode", darkmode);
    }
    updateDarkModeStatus();
    //当系统切换暗色模式时更新程序暗色模式状态
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        updateDarkModeStatus();
      });
    return { darkmode };

    onMounted(() => {
      getSetting();
    });
  },
  components: {
    player,
    PlayerFullScreen,
  },
};
</script>

<style src="./assets/style/custom-element.scss" lang="scss"/>
<style src="./assets/style/atomic-style.scss"  lang="scss"/>
<style lang="scss">
//import google material-design-icon
// @import "material-icons/iconfont/material-icons.css";
//when build to production by webpack, will had error, so change location
@import "../node_modules/material-icons/iconfont/material-icons.css";

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
    text-decoration: none;
    color: var(--text-color);

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

body {
  background-color: var(--background-color);
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
//设置主题颜色
:root {
  --primary-color: #42b983;
  --primary-color-accent: #3da878;
}
//亮色模式
:root {
  --background-color: white;
  --background-accent-color: #f8f8f8;
  --background-high-elevation-color: white;
  --text-color: #2c3e50;
  --text-title-color: black;
  --text-secondly-color: #737980;
  --text-delimiter-color: #737980bb;
  --border-color: lightgray;
  --border-color-lighter: #dddddd;
  --shadow-color: lightgray;
  --button-background-color: lightgray;
  --button-disabled-background-color: #f8f8f8;
}
//暗色模式
body[data-darkmode="true"] {
  --background-color: #39403d;
  --background-accent-color: #2d3331;
  --background-high-elevation-color: #555957;
  --text-color: lightgray;
  --text-title-color: #bbbbbb;
  --text-secondly-color: gray;
  --text-delimiter-color: #808080bb;
  --border-color: black;
  --border-color-lighter: #494d4b;
  --shadow-color: transparents;
  --button-background-color: #555957;
  --button-disabled-background-color: gray;
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
