<template>
  <main>
    <section>
      <ul>
        <li class="menu-item">
          <span>播放器全屏页面使用专辑图片作为背景</span>
          <div class="menu-item-controller">
            <el-switch
              v-model="setting.usePicAsPlayerBackground"
              inactive-color="#bbbbbb"
            ></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span
            >播放页面显示频谱
            <el-popover
              placement="top-start"
              title="警告"
              :width="200"
              trigger="hover"
              content="目前该功能开启后会消耗大量性能，在低端机型上可能会出现卡顿现象,后续可能有专项优化"
              :auto-close="8000"
            >
              <template #reference> <i class="el-icon-warning-outline"></i></template>
            </el-popover>
          </span>
          <div class="menu-item-controller">
            <el-switch
              v-model="setting.showFrequency"
              inactive-color="#bbbbbb"
            ></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span>显示翻译后的歌词</span>
          <div class="menu-item-controller">
            <el-switch
              v-model="setting.showTranslatedLyric"
              inactive-color="#bbbbbb"
            ></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span>首页 banner 切换样式</span>
          <div class="menu-item-controller">
            <el-select v-model="setting.carouselAnimateType" :size="'mini'">
              <el-option
                v-for="(key, item) in settingOption.carouselAnimateType"
                :key="item"
                :label="key"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </li>
      </ul>
    </section>
    <!-- <button @click="saveSetting">保存</button> -->
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import setting_option from "@/assets/data/setting_options.json";

export default defineComponent({
  setup() {},
  mounted() {
    this.getSetting();
  },
  data() {
    return {
      setting: {},
      settingOption: setting_option,
    };
  },
  methods: {
    getSetting() {
      let setting = {};
      //loading setting
      if (localStorage.getItem("setting") == null) {
        console.log("empty setting, will init setting");
        store.commit("initSetting");
        console.log("init setting success");
      } else {
        setting = JSON.parse(localStorage.getItem("setting")!);
        console.log("loading setting");
        this.setting = setting;
        store.commit("changeSetting", setting);
      }
    },
    saveSetting(newSetting: object) {
      store.commit("changeSetting", newSetting);
      localStorage.setItem("setting", JSON.stringify(newSetting));
      console.log("setting was save");
    },
  },
  watch: {
    setting: {
      handler(newSetting) {
        console.log("setting was change");
        this.saveSetting(newSetting);
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.menu-item {
  position: relative;
  height: 32px;
  list-style: none;
  line-height: 32px;
  span {
    position: absolute;
    left: 0;
  }
  .menu-item-controller {
    position: absolute;
    right: 10px;
  }
}
</style>