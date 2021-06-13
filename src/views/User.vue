<template>
  <!-- 个人信息 -->
  <img
    :src="userData.avatarUrl || whitePic"
    alt=""
    width="80"
    height="80"
    id="avatar"
  />
  <p>{{ userData.nickname || "" }}</p>
  <p v-if="userData.nickname">
    <el-tag type="info">{{ parseLocate(userData.city / 100) }} </el-tag>
    <el-tag type="info">注册时间：{{ parseDate(userData.createTime) }} </el-tag>
  </p>
  <br />
  <!-- 登录账号部分 -->
  <el-button type="primary" @click="showLoginDialog = true">登录</el-button>
  <el-dialog title="登录" v-model="showLoginDialog">
    <login />
  </el-dialog>
  <!-- 我的歌单 -->
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import login from "../components/Login.vue";
import axios from "../axios";
import locateData from "@/assets/data/cities.json";

export default defineComponent({
  setup() {},
  mounted() {
    this.checkLogin();
    this.getData();
  },
  components: {
    login,
  },
  data() {
    return {
      showLoginDialog: false,
      logged: false,
      userData: Object,
      whitePic:
        "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    };
  },
  methods: {
    checkLogin() {
      axios.defaults.withCredentials = true;
      axios
        .post("/login/status", { cookie: localStorage.getItem("cookie") || "" })
        .then((res) => {
          if (res.data.data.profile) {
            console.log(res);
            this.userData = res.data.data.profile;
            console.log(this.userData);
            this.logged = true;
          }
        });
    },
    parseLocate(code: number) {
      let data: any = locateData;
      for (let i = 0; i < locateData.length; i++) {
        if (code == data[i].code) {
          return data[i].name;
        }
      }
    },
    parseDate(time: number) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
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
</style>