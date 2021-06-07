<template>
  <el-tabs v-model="activePane" @tab-click="handleClick">
    <el-tab-pane label="手机号登录" name="phone">
      <el-input
        v-model="phone"
        placeholder="请输入手机号码"
        label="手机号"
      ></el-input>
      <el-input
        placeholder="请输入密码"
        v-model="password"
        show-password
        label="密码"
      ></el-input>
      <br />
      <el-button type="primary" @click="loginByPhone"
        >登录</el-button
      ></el-tab-pane
    >
    <el-tab-pane label="邮箱登录" name="email">
      <el-input
        v-model="email"
        placeholder="请输入邮箱地址"
        label="邮箱地址"
      ></el-input>
      <el-input
        placeholder="请输入密码"
        v-model="password"
        show-password
        label="密码"
      ></el-input>
      <br />
      <el-button type="primary" @click="loginByEmail"
        >登录</el-button
      ></el-tab-pane
    >
    <el-tab-pane label="二维码登录" name="QRcode">
      <img :src="qrcode || whitePic" alt="" id="qrcode" />
      <p id="qrcode_status">{{ qrcode_status }}</p>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import axios from "../axios";

export default defineComponent({
  setup() {},
  data() {
    return {
      phone: "",
      email: "",
      password: "",
      activePane: "phone",
      whitePic:
        "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
      qrcode: "",
      qrcode_status: "正在加载二维码",
      timer: 0,
    };
  },
  methods: {
    loginByPhone() {
      axios
        .post("/login/cellphone", {
          phone: this.phone,
          password: this.password,
        })
        .then((res) => {
          console.log(res);
          if (res.data.account) {
            localStorage.setItem("cookie", res.data.cookie);
          }
        });
    },
    loginByEmail() {
      axios
        .post("/login", {
          email: this.email,
          pasword: this.password,
        })
        .then((res) => {
          console.log(res);
          if (res.data.account) {
            localStorage.setItem("cookie", res.data.cookie);
          }
        });
    },
    async loginByQRCode() {
      console.log("正在进行二维码登录");
      let key: string = await axios
        .get(`/login/qr/key?timerstamp=${Date.now()}`)
        .then((res) => {
          return res.data.data.unikey;
        });
      this.qrcode = await axios
        .get(`/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`)
        .then((res) => {
          return res.data.data.qrimg;
        });
      this.qrcode_status = "等待扫码";
      this.timer = window.setInterval(() => {
        axios
          .get(`/login/qr/check?key=${key}&timerstamp=${Date.now()}`)
          .then((res) => {
            console.log(res.data);
            this.qrcode_status = res.data.message;
            if (res.data.code == 800) {
              this.qrcode="";
              clearInterval(this.timer);
            }
            if (res.data.code == 803) {
              localStorage.setItem("cookie", res.data.cookie);
              clearInterval(this.timer);
            }
          });
      }, 2000);
    },
    handleClick(tab: any, event: any) {
      console.log(tab, event);
      if (tab.props.label == "二维码登录") {
        this.loginByQRCode();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.el-input {
  width: 300px;
  margin: 8px 0;
}
#qrcode {
  width: 150px;
  height: 150px;
}
</style>
