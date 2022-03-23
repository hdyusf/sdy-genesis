<template>
  <div class="relative">
    <van-image
      class="absolute top-0 left-0 w-full -z-1"
      fit="contain-top"
      :src="auth2"
    />
    <van-image
      class="absolute bottom-0 left-0 w-full -z-2"
      fit="contain-bottom"
      :src="auth2"
    />
    <div
      class="h-14 flex justify-center items-center text-[#333] text-lg bg-white/70"
    >
      认证信息
    </div>
    <Space height="228" />
    <div class="pageCard-sm relative">
      <van-image
        class="mx-auto absolute top-0"
        :width="parseInt($pxToPxRatio(346), 10)"
        :height="parseInt($pxToPxRatio(449), 10)"
        fit="cover"
        :src="auth1"
      />
      <Space height="51" />
      <div
        class="relative z-1 grid grid-cols-3 w-full items-center justify-items-center gap-y-10 text-xs2 leading-5"
      >
        <div>作品</div>
        <div class="col-span-2 font-semibold">
          {{ detail.dcName }}
        </div>
        <div>所属者</div>
        <div class="col-span-2 text-grayTip">
          {{ detail.ownerNickName }}
        </div>
        <div>确权时间</div>
        <div class="col-span-2 text-grayTip">
          {{ detail.createTime }}
        </div>
        <div class="">
          版权ID
        </div>
        <div class="col-span-2 text-grayTip max-w-bai2 break-words text-center">
          {{ detail.certifyId }}
        </div>
        <div class=" -mt-5">
          版权声明
        </div>
        <div class="col-span-2 px-3 text-grayTip leading-6 -mt-5">
          <span class="text-redTitle">【{{ detail.createNickName }}】</span>的作品<span class="text-redTitle">《{{ detail.dcName }}》</span>于<span class="text-redTitle">【{{ detail.createTime }}】</span>经河图数藏平台区块链网络完成版权登记，并加以保护，特此声明原创权利!记，并加以保护，特此声明原创权利!
        </div>
      </div>
      <Space height="12" />
    </div>
  </div>
</template>
<script setup>
import auth1 from '@/assets/images/auth1.png';
import auth2 from '@/assets/images/auth2.png';
import { getCurrentInstance, ref } from 'vue';
import { useRoute } from 'vue-router';
let route = useRoute();
let {proxy} = getCurrentInstance();

let detail = ref({});
proxy.$http('post', `/v1/dc/certifyDescr?certifyId=${route.query.certifyId}`, {})
  .then(res => {
    detail.value = res.data;
  }).thenError(res => Toast(res.msg));
</script>
<style lang="less" scoped></style>
