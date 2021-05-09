<template>
    <input type="text">
    <button @click="edditMusicID">eddit</button>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { defineComponent } from "vue";
import { Store } from "vuex";
export default defineComponent({
    methods:{
        edditMusicID(){
            let newID:Number = parseInt(document.querySelector("input")!.value);
            this.$store.state.musicID = newID
        }
    }
})
</script>