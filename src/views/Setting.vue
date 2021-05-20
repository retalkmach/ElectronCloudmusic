<template>
  <main>
    <section>
      <ul>
        <li class="menu-item">
          <span>播放器全屏页面使用专辑图片作为背景</span>
          <input type="checkbox" name="" id="" class="switch" checked=""/>
        </li>
      </ul>
    </section>
    <div class="select-menu" data-status="close">
      <span>test</span>
      <ul>
        <li>playlist</li>
        <li>circle</li>
        <li>random</li>
      </ul>
    </div>
    <button @click="saveSetting">保存</button>
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
  mounted() {
    this.initStyle();
  },
  methods: {
    initStyle() {
      let select_menus = document.querySelectorAll(".select-menu");
      for (let i = 0; i < select_menus.length; i++) {
        select_menus[i].addEventListener("click", () => {
          select_menus[i].getAttribute("data-status") == "close"
            ? select_menus[i].setAttribute("data-status", "open")
            : select_menus[i].setAttribute("data-status", "close");
        });
        console.log(select_menus[i].childNodes);
        let lis = select_menus[i].childNodes[1].childNodes;
        for (let j = 0; j < lis.length; j++) {
          lis[j].addEventListener("click", () => {
            select_menus[i].childNodes[0].textContent = lis[j].textContent;
          });
        }
      }
    },
    saveSetting() {
      let ua = navigator.userAgent;
      let reg = /Electron/;
      let isElectron = reg.test(ua);
      console.log(isElectron);
      let setting = {
        showPlayerBg: document
          .querySelector(".switch")!
          .getAttribute("checked"),
      };
      console.log(document
          .querySelector(".switch"));
      
      if (isElectron) {
        const { ipcRenderer } = (window as any).ipcRenderer;
        // const fs = window.require("fs");
        console.log(__dirname);
        ipcRenderer.send("setting-save", JSON.stringify(setting));
      } else {
          localStorage.setting = JSON.stringify(setting);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.switch {
  -webkit-appearance: none;
  position: relative;
  width: 35px;
  height: 20px;
  background-color: lightgray;
  border-radius: 10px;
}
.switch:after {
  display: inline-block;
  position: absolute;
  left: 0;
  content: "";
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: darkgray;
  transition: 0.15s ease;
}
.switch:checked:after {
  left: 15px;
  background-color: cornflowerblue;
}

.select-menu {
  width: 80px;
  height: 20px;
  border: 1px solid gray;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}
.select-menu[data-status="close"] ul {
  display: none;
}
.select-menu[data-status="open"] ul {
  display: block;
  margin-top: 5px;
  padding: 2px 0;
  border: 1px solid lightgray;
}
.select-menu ul li {
  height: 24px;
  list-style: none;
  line-height: 24px;
  transition: 0.05s linear;
}
.select-menu ul li:hover {
  background-color: #eee;
}
.menu-item {
  position: relative;
  list-style: none;
  span {
    position: absolute;
    left: 0;
  }
  input {
    right: 0;
  }
}
</style>