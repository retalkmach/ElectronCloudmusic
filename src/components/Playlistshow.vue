<template>
  <div id="grid-container">
    <div class="card" v-for="playlist in playlistData" :key="playlist.id">
      <div class="warpper" >
        <router-link
          :to="{
            name: 'playlist',
            params: { playlistID: playlist.id },
          }"
        >
          <div class="img-container">
            <img :src="playlist.picUrl || playlist.coverImgUrl" alt="" />
          </div>
          <span>{{ playlist.name }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { use } from "element-plus/lib/locale";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["playlists", "rowLimits", "showCondition", "userId"],
  beforeMount() {
    for(let i=0;i<this.playlists.length;i++){
      if(this.checkShow(this.playlists[i].userId)){
        this.playlistData.push(this.playlists[i]);
      }
    }
  },
  computed: {
    height(): string {
      if (this.rowLimits) {
        let temp = `${this.rowLimits * 250}px`;
        return temp;
      }
      return "auto";
    },
  },
  data(){
    let playlists:Array<object> = [];
    return{
      playlistData:playlists
    }
  },
  methods: {
    checkShow(pluserId: number): boolean {
      switch (this.showCondition) {
        case "all":
          return true;
        case "created":
          if (this.userId == pluserId) {
            return true;
          } else {
            return false;
          }
        case "favorited":
          if (this.userId != pluserId) {
            return true;
          } else {
            return false;
          }
        default:
          return true;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
#grid-container {
  display: grid;
  height: v-bind(height);
  margin: 20px auto;
  overflow: hidden;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  // grid-template-rows: repeat(2,250px);
  grid-auto-flow: row;
  justify-content: center;
  justify-items: center;
  grid-template-rows: 1fr;
}
.card {
  display: inline-block;
  width: 220px;
  height: 250px;
  .img-container {
    width: 200px;
    aspect-ratio: 1/1;
    margin: 0 auto;
    img {
      width: 200px;
      aspect-ratio: 1/1;
    }
  }
  span {
    display: -webkit-inline-box;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
@media screen and (max-width: 666px) {
  #grid-container {
    height: calc(((33vw - 20px) + 50px) * 2);
    grid-template-columns: repeat(auto-fill, minmax(33vw, 1fr));
    grid-template-rows: repeat(2, calc((33vw - 20px) + 50px));
  }
  .card {
    width: 33vw;
    .img-container {
      width: calc(33vw - 20px);
      img {
        width: calc(33vw - 20px);
      }
    }
    span {
      width: calc(33vw - 24px);
    }
  }
}
</style>
