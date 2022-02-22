<template>
  <div id="color-picker">
    <div class="color-picker__color-show" v-for="(color,name) in theme" :key="name">
      <input
        type="radio"
        name="color"
        :value="name"
        class="color-picker__color"
        :style="{ backgroundColor: color }"
        @click="changeTheme(name)"
      />
      <label :for="name">{{ name }}</label>
    </div>
    <p>夜间模式<el-switch v-model="darkmode"></el-switch> </p>
    <div id="color-palettes" v-if="colorPalettes.length">
      <div
        class="color-palettes-show"
        v-for="color in colorPalettes"
        :style="{ backgroundColor: color }"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { generate, presetPalettes } from "@ant-design/colors"

let theme = {
  "默认": "var(--theme-color-default)",
  "芥花紫": "var(--theme-color-jiehuazi)",
  "景泰蓝": "var(--theme-color-jingtailan)",
  "琥珀黄": "var(--theme-color-hupohuang)",
}
let colorPalettes: Array<string> = reactive([])
let darkmode = ref(false);

function changeTheme(name: string) {
  // @ts-ignore
  let targetColor = theme[name];
  console.log(targetColor);
  document.documentElement.style.setProperty("--primary-color", targetColor)
  let colorValue = getComputedStyle(document.documentElement).getPropertyValue("--primary-color");
  colorPalettes.length = 0;
  generate(colorValue,{theme: darkmode.value?"dark":"default"}).forEach(color => {
    colorPalettes.push(color);
  });
  console.log(colorValue);
  console.log(presetPalettes);
  localStorage.setItem("theme",targetColor);
}
</script>
<style lang="scss">
#color-picker {
  position: absolute;
  top: 320px;
  left: calc((100vw - 640px) / 2);
  width: 640px;
  height: 320px;
  padding: 10px;
  border-radius: 16px;
  background-color: var(--background-high-elevation-color);
  box-shadow: 0 1px 2px 1px var(--shadow-color);
  .color-picker__color-show {
    display: inline-block;
    margin: 4px;
    .color-picker__color {
      display: block;
      -webkit-appearance: none;
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 4px;
      outline: none;
    }
    .color-picker__color:checked {
      border: 2px solid var(--border-color);
    }
  }
  .color-palettes-show {
    width: 16px;
    height: 16px;
  }
}
</style>