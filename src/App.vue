<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/test">Test</router-link> |
    <router-link to="/search">Search</router-link> |
    <router-link to="/setting">Setting</router-link> |
    <router-link to="/user">User</router-link>
  </div>
  <player-full-screen v-if="showPlayer" />
  <router-view v-else :key="$route.fullPath"/>
  <player />
</template>

<script>
import player from '@/components/Player.vue';
import store from '@/store';
import PlayerFullScreen from './views/PlayerFullScreen.vue';

export default {
  name: 'app',
  components: {
    player,
    PlayerFullScreen,
  },
  mounted() {
    this.getSetting();
  },
  computed: {
    showPlayer() {
      return this.$store.state.showPlayer;
    },
  },
  methods: {
    getSetting() {
      console.log('test');
      let setting = {};
      // loading setting
      if (localStorage.getItem('setting') == null) {
        console.log('empty setting, will init setting');
        store.commit('initSetting');
      } else {
        console.log('loading setting');
        setting = JSON.parse(localStorage.getItem('setting'));
        if (setting.version < this.$store.state.defaultSetting.version) {
          store.commit('upgradeSetting');
          return;
        }
        store.commit('changeSetting', setting);
      }
    },
  },
};
</script>

<style lang="scss">
body,
div,
p {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 25px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#player {
  position: absolute;
  top: 0;
  left: 0;
}
main {
  height: calc(100vh - 80px - 68px);
  overflow-y: scroll;
  overflow-x: hidden;
}
a {
  color: black;
}
</style>
