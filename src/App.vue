<template>
  <div class="appLayout flex flex-col relative h-full">
    <router-view />
  </div>
</template>

<script setup>
import { watchEffect } from 'vue';
import { useStore } from 'vuex';
let store = useStore();
watchEffect(() => {
  localStorage.setItem('vuex', JSON.stringify(store.state));
});
store.replaceState(JSON.parse(localStorage.vuex));
</script>

<style lang="less">
html,
body {
  font-size: 16px;
  height: 100%;
}
#app {
  position: relative;
  z-index: 1;
  font-size: 15px;
  height: 100%;
  color: #2e384d;
  font-weight: 400;
}
</style>
