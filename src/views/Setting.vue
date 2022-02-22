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
    <section>
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
    <section>
      <ul>
        <el-divider content-position="left">音频可视化</el-divider>
        <li class="menu-item">
          <span>播放页面显示频谱</span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.visualization.showFrequency" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span>
            频谱分析精度
            <el-popover
              placement="top-start"
              title="提示"
              :width="200"
              trigger="hover"
              content="显示柱形图动画时推荐选择低或中的精度，折线图选择高或较高的精度，低分辨率屏幕酌情降低精度"
              :auto-close="8000"
            >
              <template #reference>
                <i class="el-icon-warning-outline"></i>
              </template>
            </el-popover>
          </span>
          <div class="menu-item-controller">
            <el-select v-model="setting.visualization.frequencyAnalyserAccuracy" :size="'mini'">
              <el-option
                v-for="(key, item) in settingOption.frequencyAnalyserAccuracy"
                :key="item"
                :label="key"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </li>
        <li class="menu-item">
          <span>频谱动画</span>
          <div class="menu-item-controller">
            <el-select v-model="setting.visualization.animationType" :size="'mini'">
              <el-option
                v-for="(key, item) in settingOption.animationType"
                :key="item"
                :label="key"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </li>
      </ul>
    </section>
    <section>
      <ul>
        <el-divider content-position="left">高级设置</el-divider>
        <li class="menu-item">
          <span>
            限制更新听歌记录
            <el-popover
              placement="top-start"
              title="提示"
              :width="200"
              trigger="hover"
              content="开启后当歌曲实际播放时间过短时不上传听歌记录"
              :auto-close="8000"
            >
              <template #reference>
                <i class="el-icon-warning-outline"></i>
              </template>
            </el-popover>
          </span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.advanced.limitFeedback" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
      </ul>
    </section>
    <section>
      <ul>
        <el-divider content-position="left">开发者选项</el-divider>
        <li class="menu-item">
          <span>性能监测</span>
          <div class="menu-item-controller">
            <el-switch v-model="setting.developer.performanceMonitor" inactive-color="#bbbbbb"></el-switch>
          </div>
        </li>
        <li class="menu-item">
          <span>启用修改主题功能</span>
          <div class="menu-item-controller">
            <el-switch v-model="showTheme" inactive-color="#bbbbbb"></el-switch>
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
    <theme v-if="showTheme"></theme>
  </main>
</template>
<script lang="ts" setup>
import { watch, reactive, ref } from "vue";
import { useStore } from "vuex";
import projectConfig from "../../package.json";
import theme from "@/components/Theme.vue"

const store = useStore();
let setting: any = ref({});
const version = projectConfig.version;
let showTheme = ref(false);

function getSetting() {
  // loading setting
  if (localStorage.getItem("setting") == null) {
    console.log("empty setting, will init setting");
    store.commit("initSetting");
    console.log("init setting success");
  } else {
    setting.value = JSON.parse(localStorage.getItem("setting")!);
    console.log("loading setting");
    store.commit("changeSetting", setting);
  }
}
function saveSetting(newSetting: object) {
  store.commit("changeSetting", newSetting);
  localStorage.setItem("setting", JSON.stringify(newSetting));
  console.log("setting was save");
}
function initSetting() {
  //如果直接使用赋值会因为浅拷贝导致后面修改设置会污染到store的defaultSetting，所以使用深拷贝来获取初始设置
  let defaultSetting = JSON.stringify(store.state.defaultSetting);
  store.commit("initSetting");
  setting.value = JSON.parse(defaultSetting);
}
function backupSetting() {
  localStorage.setItem("backupSetting", JSON.stringify(setting));
}
function restoreSetting() {
  if (localStorage.getItem("backupSetting") != null) {
    setting.value = JSON.parse(localStorage.getItem("backupSetting")!);
    if (setting.version < store.state.defaultSetting.version) {
      store.commit("upgradeSetting");
    }
  }
}
//初始化组件
getSetting();
watch(setting, (newSetting) => {
  saveSetting(newSetting);
}, { deep: true })

//设置选项
const settingOption = {
  "carouselAnimateType": {
    "traditional": "传统",
    "fade": "渐隐渐显",
    "pullpushdoor": "推拉门"
  },
  "playBitrate": {
    "128000": "流畅播放",
    "320000": "标准音质",
    "999000": "无损"
  },
  "frequencyAnalyserAccuracy": {
    128: "低",
    256: "标准",
    512: "高",
    1024: "较高"
  },
  "animationType": {
    "Bar chart": "柱形图（默认）",
    "line chart": "折线图"
  }
}
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
