<template>
  <div id="search">
    <div id="search-box">
      <input
        type="text"
        id="search-bar"
        placeholder="搜索内容"
        v-model="keyword"
        @keyup.enter="location(keyword)"
      />
      <button id="search-button" @click="location(keyword)"><div class="icon"></div></button>
    </div>
    <div id="suggest" v-if="keyword.length">
      <ul>
        <li v-for="item in suggestcontent" :key="item" @click="location(item.keyword)">{{ item.keyword }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
import router from "@/router/index";
import axios from "axios";
export default defineComponent({
  data() {
    return {
      keyword: "",
      suggestcontent: [],
    };
  },
  methods: {
    getSuggest(keyword: string) {
      axios
        .get(`http://127.0.0.1:5052/search_suggest?keywords=${keyword}`)
        .then((res) => {
          console.log(res);
          let data = res.data.data.result.allMatch;
          console.log(data);
          this.suggestcontent = data;
          return data;
        });
    },
    location(keyword:string){
        router.push({name:'searchresult',params:{keyword:keyword}});
    }
  },
  watch: {
    keyword(newKeyword) {
      this.getSuggest(newKeyword);
    },
  },
});
</script>

<style lang="scss">
#search-box {
  display: flex;
  margin: 10px 0;
  justify-content: center;
}
#search-bar {
  width: 384px;
  height: 30px;
  box-sizing: border-box;
  margin: 0 5px;
  padding: 2px 5px;
  border: 1px solid lightgray;
  font-size: 20px;
}
#search-button {
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid lightgray;
  background-color: transparent;
  .icon {
    width: 30px;
    height: 30px;
    background-image: url(../assets/images/search.png);
    background-size: 28px 28px;
  }
}
#suggest {
  width: 419px;
  margin: 5px auto;
  ul {
    width: 419px;
    padding: 0;
    li {
      width: 419px;
      height: 32px;
      border-bottom: 1px solid lightgray;
      list-style: none;
      line-height: 32px;
      font-size: 20px;
      text-align: center;
      cursor: pointer;
      transition: 0.05s linear;
    }
    li:hover{
        background-color: lightgray;
    }
  }
}
</style>