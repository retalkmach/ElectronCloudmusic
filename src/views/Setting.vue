<template>
  <main>
    <section>
      <ul>
        <li class="menu-item">
          <span>播放器全屏页面使用专辑图片作为背景</span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.usePicAsPlayerBackground" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span>
            播放页面显示频谱
            <el-popover
              placement="top-start"
              title="警告"
              :width="200"
              trigger="hover"
              content="目前该功能开启后会消耗大量性能，在低端机型上可能会出现卡顿现象,后续可能有专项优化"
              :auto-close="8000"
            >
              <template #reference>
                <i class="el-icon-warning-outline"></i>
              </template>
            </el-popover>
          </span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.showFrequency" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span>
            更新听歌记录
            <el-popover
              placement="top-start"
              title="提示"
              :width="200"
              trigger="hover"
              content="开启后播放完一首歌后会向网易云服务器报告听歌记录，个人主页的听歌排行会更新数据"
              :auto-close="8000"
            >
              <template #reference>
                <i class="el-icon-warning-outline"></i>
              </template>
            </el-popover>
          </span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.feedback" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span>显示翻译后的歌词</span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.showTranslatedLyric" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span>自动签到</span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.autoSign" inactive-color="#bbbbbb"></el-switch>
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
        <li class="menu-item">
          <span>默认播放音质</span>
          <div class="menu-item-controller">
            <el-select v-model="setting.playBitrate" :size="'mini'">
              <el-option
                v-for="(key, item) in settingOption.playBitrate"
                :key="item"
                :label="key"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </li>
      </ul>
    </section>
    <section v-if="setting.appearance">
      <ul>
        <el-divider content-position="left">外观</el-divider>
        <li class="menu-item">
          <span>跟随系统切换暗色模式</span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.appearance.autoToogleDarkMode" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
      </ul>
    </section>
    <section v-if="setting.advanced">
      <ul>
        <el-divider content-position="left">高级设置</el-divider>
        <li class="menu-item">
          <span>原生进度条样式</span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.advanced.useNativeRange" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
      </ul>
    </section>
    <section v-if="setting.developer">
      <ul>
        <el-divider content-position="left">开发者选项</el-divider>
        <li class="menu-item">
          <span>性能监测</span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.developer.performanceMonitor" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
        <li>
          <el-button type="info" round @click="backupSetting">备份设置</el-button>
          <el-button type="warning" round @click="restoreSetting">还原设置</el-button>
        </li>
      </ul>
    </section>
    <section id="info">
      <span>当前版本：{{ version }}</span>
    </section>
    <!-- <button @click="saveSetting">保存</button> -->
    <section>
      <el-button round type="danger" @click="initSetting">重置设置</el-button>
    </section>
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import setting_option from "@/assets/data/setting_options.json";
import projectConfig from "../../package.json";

export default defineComponent({
  setup() { },
  mounted() {
    this.getSetting();
  },
  data() {
    return {
      setting: Object as any,
      settingOption: setting_option,
      version: projectConfig.version,
    };
  },
  methods: {
    getSetting() {
      let setting = {};
      // loading setting
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
    initSetting() {
      //如果直接使用赋值会因为浅拷贝导致后面修改设置会污染到store的defaultSetting，所以使用深拷贝来获取初始设置
      let defaultSetting = JSON.stringify(store.state.defaultSetting);
      store.commit("initSetting");
      this.setting = JSON.parse(defaultSetting);
      // this.setting = Object.create(store.state.defaultSetting);
      // this.setting = store.state.defaultSetting;
      // this.saveSetting(store.state.defaultSetting);
    },
    backupSetting() {
      localStorage.setItem("backupSetting", JSON.stringify(this.setting));
    },
    restoreSetting() {
      if (localStorage.getItem("backupSetting") != null) {
        this.setting = JSON.parse(localStorage.getItem("backupSetting")!);
        if (this.setting.version < store.state.defaultSetting.version) {
          store.commit("upgradeSetting");
        }
      }
    }
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
ul {
  margin: 0;
  padding: 0 15px;
  li {
    list-style: none;
  }
}
.menu-item {
  position: relative;
  height: 32px;
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
#info {
  span {
    display: inline-block;
    width: 320px;
    height: 26px;
    margin: 4px;
    border-radius: 12px;
    line-height: 26px;
    cursor: default;
    transition: 0.5s linear;
  }
  span:hover {
    backdrop-filter: brightness(0.75);
  }
}
</style>
