<template>
  <main>
    <searchBar />
    <div id="search-history">
      <div class="search-history__title user-select--none">
        <span>搜索历史</span>
        <span class="material-icons" @click="deleteSearchHistory()">delete</span>
      </div>
      <div class="search-history__content">
        <el-tag
          closable
          size="small"
          type="info"
          v-for="(history, index) in searchHistory"
          :key="history"
          @click="location(history)"
          @close="deleteSearchHistory(index)"
        >{{ history }}</el-tag>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import axios from "../axios";
import searchBar from "@/components/SearchBar.vue";

export default defineComponent({
  mounted() {
    this.getSearchHistory();
  },
  components: {
    searchBar,
  },
  data() {
    let searchHistory: Array<string> = [];
    return {
      searchHistory: searchHistory,
    };
  },
  methods: {
    location(keyword: string) {
      this.setSearchHistory(keyword);
      this.$router.push({ path: "/searchresult/" + keyword });
    },
    getSearchHistory() {
      if (localStorage.getItem("searchHistory")) {
        this.searchHistory = JSON.parse(localStorage.getItem("searchHistory")!);
      } else {
        this.searchHistory = [];
      }
    },
    setSearchHistory(keyword: string) {
      //判断是否有必要修改历史记录
      if (keyword === this.searchHistory[0]) {
        return false;
      } else {
        //判断历史记录中是否有相同的记录，有则提前，无则插入
        if (this.searchHistory.indexOf(keyword) === -1) {
          this.searchHistory.unshift(keyword);
          if (this.searchHistory.length > 10) {
            this.searchHistory.pop();
          }
        } else {
          this.searchHistory.splice(this.searchHistory.indexOf(keyword), 1);
          this.searchHistory.unshift(keyword);
        }
        localStorage.setItem(
          "searchHistory",
          JSON.stringify(this.searchHistory)
        );
      }
    },
    deleteSearchHistory(index?: number) {
      if (typeof index === "undefined") {
        while (this.searchHistory.length) {
          this.searchHistory.pop();
        }
      } else {
        this.searchHistory.splice(index, 1);
      }
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },
  },
});
</script>

<style lang="scss">
/* 因为搜索框组件的搜索建议被设为绝对定位脱离了文档流，在这里会造成高度坍塌，搜索建议无法完全展示，此处进行处理 */
#search {
  #suggest {
    position: relative;
  }
}
</style>
<style lang="scss" scoped>
#search-history {
  position: absolute !important;
  top: 150px;
  right: 10px;
  min-width: 320px;
  width: 20vw;
  max-width: 640px;
  height: auto;
  padding: 6px 0;
  border: 1px solid var(--border-color-lighter);
  border-radius: 8px;
  background-color: var(--background-accent-color);
  .search-history__title {
    font-weight: 600;
    span {
      vertical-align: middle;
    }
  }
  .search-history__content {
    margin: 4px 0;
    padding: 5px;
    span {
      margin: 0 2px;
      cursor: pointer;
    }
  }
}
</style>