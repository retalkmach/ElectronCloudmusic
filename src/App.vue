<template>
  <div id="nav">
    <router-link to="/">Home</router-link>|
    <router-link to="/fm">PersonalFM</router-link>|
    <router-link to="/search">Search</router-link>|
    <router-link to="/setting">Setting</router-link>|
    <router-link to="/user">User</router-link>
  </div>
  <router-view />
  <player />
</template>

<script>
import player from "@/components/Player.vue";
import { useStore } from "vuex";
import PlayerFullScreen from "./views/PlayerFullScreen.vue";
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import { ref, watch } from "vue";

export default {
  name: "app",
  setup() {
    const store = useStore();

    let systemPerferDarkMode;
    let darkmode;

    // console.log = ()=>{};

    //get setting
    function getSetting() {
      let setting = {};
      // loading setting
      if (localStorage.getItem("setting") == null) {
        console.log("empty setting, will init setting");
        store.commit("initSetting");
      } else {
        console.log("loading setting");        
        setting = JSON.parse(localStorage.getItem("setting"));
        console.log(`current setting version is ${setting.version}, latest version is ${store.state.defaultSetting.version}`);
        if (setting.version < store.state.defaultSetting.version) {
          store.commit("upgradeSetting");
          return;
        }
        store.commit("changeSetting", setting);
      }
    }
    function updateDarkModeStatus() {
      systemPerferDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (store.state.setting.appearance) {
        darkmode =
          store.state.setting.appearance.autoToogleDarkMode &&
          systemPerferDarkMode;
      } else {
        darkmode = systemPerferDarkMode;
      }
      document.querySelector("body").setAttribute("data-darkmode", darkmode);
    }

    //初始化
    getSetting();
    //加载主题和播放列表
    updateDarkModeStatus();
    if(localStorage.getItem("playlist")!=null){
      let playlist =  JSON.parse(localStorage.getItem("playlist"));
      store.commit("replacePlaylist",{playlist:playlist,cursor:0});
    };
    document.documentElement.style.setProperty("--primary-color", localStorage.getItem("theme")||"var(--theme-color-default)");

    //当系统切换暗色模式时更新暗色模式状态
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        updateDarkModeStatus();
      });

    return { darkmode };
  },
  components: {
    player,
    PlayerFullScreen,
  },
};
</script>

<style src="./assets/style/custom-element.scss" lang="scss">
</style>
<style src="./assets/style/atomic-style.scss"  lang="scss">
</style>
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
    color: var(--text-color);

    &.router-link-exact-active {
      color: var(--primary-color);
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
  color: inherit;
  text-decoration: none;
}
//定义主题颜色
:root {
  --theme-color-default: #42b983;
  --theme-color-jiehuazi: #983680;
  --theme-color-jingtailan: #2775b6;
  --theme-color-hupohuang: #feba07;
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
  --text-color: #000000df;
  --text-title-color: black;
  --text-secondly-color: #0000009a;
  --text-delimiter-color: #00000061;
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
