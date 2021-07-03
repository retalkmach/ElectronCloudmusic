<template>
  <input type="text" />
  <button @click="edditMusicID">eddit</button>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { defineComponent } from 'vue';
import { Store } from 'vuex';

const createRequest = require('@/utils/request');

export default defineComponent({
  setup() {
    const data = {
      s: 'fade away',
      type: 1,
      limit: 50,
      offset: 0,
    };
    console.log(createRequest(data, 'https://music.163.com/weapi/search/get', {}));
  },
  methods: {
    edditMusicID() {
      const newID: number = parseInt(document.querySelector('input')!.value);
      this.$store.state.musicID = newID;
    },
  },
});
</script>
