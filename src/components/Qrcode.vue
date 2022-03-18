<template>
  <QrcodeVue
    :value="value"
    :size="size"
    level="H"
  />
</template>
<script setup>
import { ref, defineProps } from 'vue';
import QrcodeVue from 'qrcode.vue';
const props = defineProps({
  value: {
    type: String,
    require: true,
    default: '',
  },
  size: {
    type: Number,
    default: 100
  }
});
const state = ref({
  value: props.value,
  size: props.size
});
</script>
<style lang="less" scoped>
</style>
