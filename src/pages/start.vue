<template>
  <van-image
    class="w-full h-full"
    fit="cover"
    :src="startLoad"
  />
  <div class=" absolute right-5 top-5 z-1 text-white ring-2 px-4 text-center ring-white/50 rounded-full text-sm py-1">
    {{ showCountDown }}
    <span
      class=" text-xs2"
      @click="nextPage"
    >跳过</span>
  </div>
</template>
<script setup>
import startLoad from '@/assets/images/startLoad.png';
import { useRouter } from 'vue-router';
import { useCountDown } from '@vant/use';
import { computed, watch } from 'vue';
let router = useRouter();
let time = 4000;

window.plus?.navigator.setStatusBarBackground('#9F241B');
window.plus?.navigator.setStatusBarStyle('light');
const countDown = useCountDown({
  time: time,
  millisecond: true,
});
countDown.start();
let showCountDown = computed(() => {
  return countDown.current.value.seconds;
});

watch(showCountDown, (val) => {
  if (val === 0) {
    nextPage();
  }
});
function nextPage() {
  window.plus?.navigator.setStatusBarStyle('dark');
  window.plus?.navigator.setStatusBarBackground('white');
  router.replace('/');
}
</script>
<style lang="less" scoped>
</style>
