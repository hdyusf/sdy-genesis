<template>
  <div class="">
    <van-image
      class="absolute top-0 left-0 w-full h-full -z-1"
      fit="cover-top"
      :src="auth2"
    />
    <div class=" h-14 flex justify-center items-center text-[#333] text-lg bg-white/70">
      认证信息
    </div>
    <div class="relative">
      <van-image
        class="absolute top-0 left-0 w-full h-full -z-1"
        fit="cover-top"
        :src="auth2"
      />
    </div>
  </div>
</template>
<script setup>
import auth1 from '@/assets/images/auth1.png';
import auth2 from '@/assets/images/auth2.png';
</script>
<style lang="less" scoped>
</style>
