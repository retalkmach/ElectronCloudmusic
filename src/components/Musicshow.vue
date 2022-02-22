<template>
  <div id="songs">
    <ul v-if="datas.length != 0" @click.right="toggleMenuShow">
      <li v-for="(item, index) in datas" :key="item.id" @click.right.prevent="chooseIndex = index">
        <div class="title" v-on:click="playMusic(index)" role="button">
          {{ item.name }}
          <!-- <span v-if="item.alias.length!=0">({{ item.alias[0] }})</span> -->
        </div>
        <div class="artists" v-if="item.ar">
          <span v-for="artist in item.ar" :key="artist.id">
            <router-link :to="{ path: '/artist/' + artist.id }">{{ artist.name }}</router-link>
          </span>
        </div>
        <div class="artists" v-else>
          <span v-for="artist in item.artists" :key="artist.id">
            <router-link :to="{ path: '/artist/' + artist.id }">{{ artist.name }}</router-link>
          </span>
        </div>
        <div class="album">
          <router-link :to="{ path: '/album/' + item.al.id }" v-if="item.al">
            {{
              item.al.name
            }}
          </router-link>
          <router-link :to="{ path: '/album/' + item.album.id }" v-else>
            {{
              item.album.name
            }}
          </router-link>
        </div>
      </li>
    </ul>
    <teleport to="body">
      <div id="right-menu" v-show="showMenu">
        <ul>
          <li @click="addPlaylist">下一首播放</li>
        </ul>
      </div>
      <div id="modal" v-show="showMenu"></div>
    </teleport>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, toRefs } from "vue";
import {useStore} from "vuex";
import router from "@/router/index";

const store = useStore();
const props = defineProps<{
  datas: any
}>();
const { datas } = toRefs(props);
const data = datas.value;
const showMenu = ref(false);
const chooseIndex = ref(0);

function playMusic(index: number | string | symbol) {
  if(showMenu.value){
    return false;
  }
  const newPlaylist = [];
  for (let i = 0; i < data.length; i++) {
    const artists: Array<any> = [];
    const song = {
      id: data[i].id,
      name: data[i].name,
      artists,
    };
    for (
      let j = 0;
      j < data[i]?.ar?.length ?? data[i].artists.length;
      j++
    ) {
      song.artists.push(
        data[i].ar[j].name ?? data[i].artists[j].name
      );
    }
    newPlaylist.push(song);
  }
  const newData = {
    playlist: newPlaylist,
    cursor: index,
  };
  console.log(data);  
  store.commit("switchPlayerMode", "normal");
  store.commit("replacePlaylist", newData);
  savePlaylist();
}
function toggleMenuShow(event: MouseEvent) {
  if (1) {
    let menu = <HTMLElement>document.querySelector("#right-menu");
    let windowWidth = document.body.clientWidth;
    let windowHeight = document.body.clientHeight;
    if (windowWidth - event.clientX < 120) {
      menu.style.right = windowWidth - event.clientX + "px";
    } else {
      menu.style.left = event.clientX + "px";
    }
    if (windowHeight - event.clientY - 80 < 50) {
      menu.style.top = "";
      menu.style.bottom = windowHeight - event.clientY + 80 + "px";
    } else {
      menu.style.top = event.clientY + "px";
      menu.style.bottom = "";
    }
    document.addEventListener("click", closeMenu);
  }
  showMenu.value = !showMenu.value;
}
function closeMenu() {
  showMenu.value = false;
  document.removeEventListener("click", closeMenu,true);
}
function addPlaylist() {
  let songdata: any = {
    id: data[chooseIndex.value].id,
    name: data[chooseIndex.value].name,
    artist: [],
  };
  for (
    let i = 0;
    i < data[chooseIndex.value]?.ar?.length ??
    data[chooseIndex.value]?.artists?.length;
    i++
  ) {
    songdata.artist.push(
      data[chooseIndex.value]?.ar[i]?.name ??
      data[chooseIndex.value].artists[i].name
    );
  }
  store.commit("addPlaylist", songdata);
  savePlaylist();
}
function savePlaylist() {
  localStorage.setItem("playlist", JSON.stringify(store.state.playlist));
}
onBeforeUnmount: {
  document.removeEventListener("click", closeMenu);
}
</script>
<style lang="scss" scoped>
#songs {
  ul {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    // margin-bottom: 80px;
    padding: 0px;
    li {
      display: contents;
      list-style: none;
      text-align: left;
      div {
        display: inline-block;
        height: 32px;
        //   border-bottom: 1px solid lightgray;
        line-height: 32px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .title {
        padding-left: 5px;
      }
      .artists > span:not(:last-of-type)::after {
        content: "/";
        margin: 0 2px;
      }
      a {
        color: var(--text-secondly-color);
        text-decoration: none;
      }
    }
    li:nth-child(2n-1) div {
      background-color: var(--background-accent-color);
    }
  }
}
#right-menu {
  position: absolute;
  width: 180px;
  border-radius: 4px;
  background-color: var(--background-high-elevation-color);
  // box-shadow: 0px 0px 2px 1px lightgray;
  border: 1px solid var(--shadow-color);
  z-index: 2;
  ul {
    margin: 2px 0;
    padding-left: 5px;
    list-style: none;
    color: var(--text-color);
    li {
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      user-select: none;
    }
    li:hover {
      background-color: var(--background-accent-color);
    }
  }
}
#modal{
  position: absolute;
  top: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: #00000066;
  z-index: 1;
}
</style>