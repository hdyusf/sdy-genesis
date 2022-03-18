<template>
  <div
    class="Space flex-shrink-0"
    :style="{
      width: $pxToVw(width),
      height: $pxToVw(height),
      backgroundColor,
    }"
  />
</template>

<script >
export default {
  name: 'Space',
  props: {
    backgroundColor: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '0',
      validator(res) {
        return Number(res).toString() === res.toString();
      },
    },
    width: {
      type: String,
      default: '0',
      validator(res) {
        return Number(res).toString() === res.toString();
      },
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="less">
</style>
