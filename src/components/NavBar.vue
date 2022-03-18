<template>
  <div class="NavBarBox">
    <van-nav-bar
      :title="title"
      fixed
      z-index="2"
      placeholder
      :border="false"
      :class="{ 'transparent': transparent }"
    >
      <template #left>
        <van-icon
          v-if="goBack"
          name="arrow-left"
          :size="$pxToPxRatio(20)"
          color="#000000"
          @click="$router.back()"
        />
        <slot name="left" />
      </template>
      <template #right>
        <slot name="right" />
      </template>
    </van-nav-bar>
  </div>
</template>
<script>
export default {
  name: 'NavBar',
  // mixins: [],
  // components: {},
  props: {
    goBack: {
      type: Boolean,
      default: true,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  // created () {},
  // mounted () {},
  methods: {},
  // watch: {},
  // computed: {},
  // filters: {},
  // beforeDestroy () {},
};
</script>
<style scoped lang="less">
.NavBarBox {
  &.noBorder {
    /deep/ .van-nav-bar {
      &:after {
        display: none;
      }
    }
  }
}
</style>
