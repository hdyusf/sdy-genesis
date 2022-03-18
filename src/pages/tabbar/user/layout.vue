<template>
  <router-view />
</template>
<script setup>
import { useStore } from 'vuex';
let store = useStore();

store.dispatch('getUserinfo');
</script>
<style lang="less" scoped>
</style>
