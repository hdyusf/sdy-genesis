<template>
  <NavBar :title="props.title" />
  <div class=" pageCard-sm bg-grayBg py-6 px-6 whitespace-pre-wrap">
    {{ props.content }}
  </div>
</template>
<script setup>
let props = defineProps({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
});
</script>
<style lang="less" scoped>
</style>
