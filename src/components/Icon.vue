<template>
  <svg
    class="icon"
    :style="{ fontSize: $pxToVw(size), color: color }"
    aria-hidden="true"
  >
    <use :xlink:href="'#' + type" />
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      default: 'icon-pai',
    },
    size: {
      type: String,
      default: '40',
    },
    color: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="less">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
