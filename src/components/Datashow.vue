<template>
  <div id="data-show">
    <ul>
      <li class="data-show-list" v-for="data in datas">
        <router-link :to="{ path: '/' + type + '/' + data.id }">
          <img :src="(data['picUrl']||data['coverImgUrl']) + '?param=108y108'" />
          {{ data.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router"
import { setup } from "vue-class-component";
export default {
  props: {
    datas: Object as any,
    type: String
  },
  setup(props: any) {
    console.log(props);
    const router = useRouter();

  }
}

</script>
<style lang="scss">
#data-show {
  ul {
    margin: 0;
    padding: 0;
  }
}
.data-show-list {
  position: relative;
  list-style: none;
  height: 72px;
  line-height: 72px;
  img {
    position: absolute;
    left: 10px;
    top: 4px;
    width: 64px;
    aspect-ratio: 1/1;
    object-fit: cover;
  }
}
.data-show-list:nth-child(2n) {
  background-color: var(--background-accent-color);
}
</style>