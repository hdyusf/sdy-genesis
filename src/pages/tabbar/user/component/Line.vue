<template>
  <div
    class="LineComponent flex items-center justify-between"
    @click="() => $router.push(url)"
  >
    <div class=" text-sm">
      {{ props.title }}
    </div>
    <div class="flex items-center justify-center text-grayDefault">
      <div class=" text-sm text-grayDefault">
        {{ props.value }}
      </div>
      <van-icon
        v-if="props.rightIcon"
        name="arrow"
        class=" text-grayDefault ml-3"
      />
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';

let props = defineProps({
  title: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  rightIcon: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: '',
  },
});
</script>
<style lang="less" scoped>
</style>
