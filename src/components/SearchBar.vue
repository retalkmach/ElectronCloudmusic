<template>
  <div id="search">
    <div id="search-box">
      <input
        type="text"
        id="search-bar"
        placeholder="搜索内容"
        autofocus
        v-model="keyword"
        @keyup.enter="location(keyword)"
        autocomplete="off"
      />
      <button id="search-button" @click="location(keyword)">
        <span class="material-icons">search</span>
      </button>
    </div>
    <div id="suggest" v-if="keyword.length">
      <ul>
        <li
          v-for="item in suggestcontent"
          :key="item"
          @click="location(item.keyword)"
        >{{ item.keyword }}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios";

const router = useRouter();

let keyword = ref("");
let suggestcontent: Array<string> = reactive([]);
let throttleTimestamp = 0;

function location(keyword: string) {
  setSearchHistory(keyword);
  router.push({ path: "/searchresult/" + keyword });
}
function getSuggest() {
  if (Date.now() - throttleTimestamp > 750) {
    if (keyword.value === "") {
      return false;
    }
    throttleTimestamp = Date.now();
    axios
      .get(`/search/suggest?keywords=${keyword.value}&type=mobile`)
      .then((res) => {
        while (suggestcontent.length) {
          suggestcontent.pop();
        }
        for (let i = 0; i < res.data.result.allMatch.length; i++) {
          suggestcontent.push(res.data.result.allMatch[i]);
        }
      });
  }
}
function setSearchHistory(keyword: string) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")!);
  //判断是否有必要修改历史记录
  if (keyword === searchHistory[0]) {
    return false;
  } else {
    //判断历史记录中是否有相同的记录，有则提前，无则插入
    if (searchHistory.indexOf(keyword) === -1) {
      searchHistory.unshift(keyword);
      if (searchHistory.length > 10) {
        searchHistory.pop();
      }
    } else {
      searchHistory.splice(searchHistory.indexOf(keyword), 1);
      searchHistory.unshift(keyword);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
}
watch(keyword, () => {
  getSuggest();
});
</script>
<style lang="scss" scoped>
#search {
  position: relative;
  width: 60vw;
  min-width: 280px;
  max-width: 1080px;
  margin: 10px auto;
}
#search-box {
  width: 100%;
  position: relative;
  margin: 10px auto;
}
#search-bar {
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  padding: 5px 15px;
  border: 1px solid var(--border-color-lighter);
  border-radius: 18px;
  background-color: var(--background-high-elevation-color);
  font-size: 20px;
  color: var(--text-color);
  &:focus {
    outline: none;
    box-shadow: 0 0 2px 1px var(--shadow-color);
  }
}
#search-button {
  position: absolute;
  right: 12px;
  top: 4px;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  background-color: transparent;
  span {
    font-size: 26px;
    color: var(--text-color);
  }
}
#suggest {
  position: absolute;
  width: 60vw;
  min-width: 280px;
  max-width: 1080px;
  margin-top: -10px;
  box-sizing: border-box;
  background-color: var(--background-color);
  border: 1px solid var(--border-color-lighter);
  border-top: none;
  ul {
    width: 100%;
    margin: 0;
    padding: 0;
    li {
      width: 100%;
      height: 32px;
      list-style: none;
      line-height: 32px;
      font-size: 20px;
      text-align: center;
      cursor: pointer;
      transition: 0.05s linear;
    }
    li:hover {
      background-color: var(--background-accent-color);
    }
    li:not(:last-of-type) {
      border-bottom: 1px solid lightgray;
    }
  }
}

::-webkit-input-placeholder {
  color: var(--text-secondly-color);
}
</style>