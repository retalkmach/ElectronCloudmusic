<template>
  <main>
    <!-- 个人信息 -->
    <img
      :src="userData.avatarUrl || whitePic"
      alt=""
      width="80"
      height="80"
      id="avatar"
    />
    <p>
      {{ userData.nickname || "" }}
      <el-button round @click="sign" :size="'mini'" :disabled="signed"
        >签到</el-button
      >
    </p>
    <p v-if="userData.nickname">
      <el-tag type="info">{{ parseLocate(userData.city / 100) }} </el-tag>
      <el-tag type="info"
        >注册时间：{{ parseDate(userData.createTime) }}
      </el-tag>
    </p>
    <br />
    <!-- 登录账号部分 -->
    <el-button type="primary" @click="showLoginDialog = true" v-if="!logged"
      >登录</el-button
    >
    <el-dialog title="登录" v-model="showLoginDialog">
      <login @logged="loginSuccess" />
    </el-dialog>
    <!-- 我的歌单 -->
    <el-collapse v-model="collapseShow">
      <el-collapse-item title="我创建的歌单">
        <playlistshow
          v-if="playlist.length > 0"
          :playlists="playlist"
          :showCondition="'created'"
          :userId="userData.userId"
        />
      </el-collapse-item>
      <el-collapse-item title="我收藏的歌单">
        <playlistshow
          v-if="playlist.length > 0"
          :playlists="playlist"
          :showCondition="'favorited'"
          :userId="userData.userId"
        />
      </el-collapse-item>
    </el-collapse>
  </main>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent, h } from "vue";
import login from "../components/Login.vue";
import playlistshow from "../components/Playlistshow.vue";
import axios from "../axios";
import locateData from "@/assets/data/cities.json";
import { ElMessage } from "element-plus";

export default defineComponent({
  setup() {},
  mounted() {
    this.checkLogin();
    this.getData();
    this.checkSign();
  },
  components: {
    login,
    playlistshow,
  },
  data() {
    let playlist: Array<object> = [];
    return {
      showLoginDialog: false,
      logged: false,
      signed: false,
      userData: Object as any,
      playlist: playlist,
      whitePic:
        "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
      collapseShow: [],
    };
  },
  methods: {
    loginSuccess() {
      this.showLoginDialog = false;
      this.checkLogin();
      this.checkSign();
    },
    checkLogin() {
      axios.defaults.withCredentials = true;
      axios
        .post(`/login/status?timeStamps=${Date.now()}`, {
          cookie: localStorage.getItem("cookie") || "",
        })
        .then((res) => {
          if (res.data.data.profile) {
            this.userData = res.data.data.profile;
            this.logged = true;
            this.getPlaylist();
          }
        });
    },
    checkSign() {
      axios
        .post(`/yunbei/today?timeStamps=${Date.now()}`, {
          cookie: localStorage.getItem("cookie") || "",
        })
        .then((res) => {
          if (res.data.data) {
            this.signed = true;
          } else {
            if (this.$store.state.setting.autoSign) {
              this.sign();
            }
          }
        });
    },
    sign() {
      axios
        .post(`/yunbei/sign?timeStamps=${Date.now()}`, {
          cookie: localStorage.getItem("cookie") || "",
          type: 1,
        })
        .then((res) => {
          ElMessage({ message: `签到成功,云贝+${res.data.point}` });
          this.signed = true;
        })
        .catch((res) => {
          ElMessage({ message: `签到失败` });
        });
    },
    getPlaylist() {
      axios
        .post(`/user/playlist?uid=${this.userData.userId}`, {
          cookie: localStorage.getItem("cookie") || "",
        })
        .then((res) => {
          for (let i = 0; i < res.data.playlist.length; i++) {
            this.playlist.push(res.data.playlist[i]);
          }
        });
    },
    parseLocate(code: number) {
      const data: any = locateData;
      for (let i = 0; i < locateData.length; i += 1) {
        if (code == data[i].code) {
          return data[i].name;
        }
      }
    },
    parseDate(time: number) {
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year} 年 ${month} 月 ${day} 日`;
    },
    getData() {
      axios
        .post("/user/subcount", {
          cookie: localStorage.getItem("cookie") || "",
        })
        .then((res) => {
          console.log(res);
        });
    },
  },
});
</script>
<style lang="scss" scoped>
#avatar {
  // border: 1px solid lightgray;
  box-shadow: 0px 0px 2px 1px lightgray;
  border-radius: 50%;
}
[class^="el-collapse"] {
  width: calc(100vw - 15px);
  margin: 0 auto;
}
//暗色模式下覆盖element ui 默认样式
.el-collapse {
  --el-collapse-border-color:var(--border-color);
  --el-collapse-header-background-color: var(--background-color);
  --el-collapse-header-font-color: var(--text-color);
  --el-collapse-content-background-color: var(--background-color);
}
</style>