<template>
  <van-empty
    v-show="emptyShow"
    :image="type"
    :description="props.title"
    class="flex flex-auto pb-52"
  />
</template>
<script setup>
import empty1 from '@/assets/images/empty1.png';
import empty2 from '@/assets/images/empty2.png';
import empty3 from '@/assets/images/empty3.png';
import empty4 from '@/assets/images/empty4.png';
import empty5 from '@/assets/images/empty5.png';
import empty6 from '@/assets/images/empty6.png';
import empty7 from '@/assets/images/empty7.png';
import { defineProps, computed, ref } from 'vue';
let props = defineProps({
  type: {
    type: String,
    default: 'noData'
  },
  title: {
    type: String,
    default: '暂无数据'
  },
});
let type = computed(() => {
  let r = empty1;
  switch(props.type) {
    case 'noData':
      r = empty1;
      break;
    case 'order':
      r = empty2;
      break;
    case 'orderError':
      r = empty3;
      break;
    case 'orderSuccess':
      r = empty4;
      break;
    case 'wifi':
      r = empty5;
      break;
    case 'bank':
      r = empty6;
      break;
    case 'collect':
      r = empty7;
      break;
  }
  return r;
});
let emptyShow = ref(false);
setTimeout(() => {
  emptyShow.value = true;
}, 300);
</script>
<style scoped lang="less">
</style>
