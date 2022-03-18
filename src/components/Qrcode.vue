<template>
  <QrcodeVue
    :value="props.value"
    :size="props.size"
    :margin="props.margin"
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
  },
  margin: {
    type: Number,
    default: 0
  },
});
</script>
<style lang="less" scoped>
</style>
