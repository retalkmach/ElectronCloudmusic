<template>
  <div id="songs">
    <ul v-if="datas.length != 0" @click.right="toggleMenuShow">
      <li
        v-for="(item, index) in datas"
        :key="item.id"
        v-bind:class="autoAddClass(index)"
        @click.right.prevent="chooseIndex = index"
      >
        <div class="title" v-on:click="playMusic(index)" role="button">{{ item.name }}</div>
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
    </teleport>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import store from "@/store";

export default defineComponent({
  props: ["datas"],
  data() {
    return {
      showMenu: false,
      chooseIndex: 0,
    };
  },
  methods: {
    playMusic(index: number | string | symbol) {
      const newPlaylist = [];
      for (let i = 0; i < this.datas.length; i++) {
        const artists: Array<any> = [];
        const song = {
          id: this.datas[i].id,
          name: this.datas[i].name,
          artists,
        };
        for (
          let j = 0;
          j < this.datas[i]?.ar?.length ?? this.datas[i].artists.length;
          j++
        ) {
          song.artists.push(
            this.datas[i].ar[j].name ?? this.datas[i].artists[j].name
          );
        }
        newPlaylist.push(song);
      }
      const newData = {
        playlist: newPlaylist,
        cursor: index,
      };
      store.commit("switchPlayerMode", "normal");
      store.commit("replacePlaylist", newData);
    },
    autoAddClass(index: number) {
      return index % 2 == 0 ? "bg" : "";
    },
    toggleMenuShow(event: MouseEvent) {
      if (!this.showMenu) {
        let menu = <HTMLElement>document.querySelector("#right-menu");
        let windowWidth = document.body.clientWidth;
        let windowHeight = document.body.clientHeight;
        if (windowWidth - event.clientX < 120) {
          menu.style.right = windowWidth - event.clientX + "px";
        } else {
          menu.style.left = event.clientX + "px";
        }
        if (windowHeight - event.clientY < 50) {
          menu.style.bottom = windowHeight - event.clientY + "px";
        } else {
          menu.style.top = event.clientY + "px";
        }
        document.addEventListener("click", this.closeMenu);
      }
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      this.showMenu = false;
      document.removeEventListener("click", this.closeMenu);
    },
    addPlaylist() {
      let songdata: any = {
        id: this.datas[this.chooseIndex].id,
        name: this.datas[this.chooseIndex].name,
        artist: [],
      };
      for (
        let i = 0;
        i < this.datas[this.chooseIndex]?.ar?.length ??
        this.datas[this.chooseIndex]?.artists?.length;
        i++
      ) {
        songdata.artist.push(
          this.datas[this.chooseIndex]?.ar[i]?.name ??
          this.datas[this.chooseIndex].artists[i].name
        );
      }
      store.commit("addPlaylist", songdata);
    },
  },
});
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
    li.bg > div {
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
  }
}
</style>