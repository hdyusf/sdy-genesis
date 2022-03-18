<template>
  <div class="relative z-1 pageCard-sm">
    <van-image
      class="w-full absolute top-0 left-0 -z-2"
      :height="parseInt($pxToPxRatio(208), 10)"
      fit="cover"
      :src="creatorInfo?.backImg || '123'"
      :icon-size="parseInt($pxToPxRatio(208), 10)"
      :error-icon="a1"
    />
    <div
      class="absolute top-28 left-0 w-full -z-1 px15"
      :style="{
        height: $pxToPxRatio(128) + 'px',
      }"
    >
      <div
        class="bg-white/30 w-full h-full rounded-lg2 backdrop-blur-lg shadow-lg"
      />
    </div>
    <Space height="30" />
    <div class="flex items-center justify-between">
      <Icon
        type="icon-fanhui"
        size="23"
        @click="() => $router.back()"
      />
      <van-image
        :width="parseInt($pxToPxRatio(33), 10)"
        :height="parseInt($pxToPxRatio(33), 10)"
        fit="cover"
        :src="a2"
        @click="() => $router.back()"
      />
    </div>
    <Space height="5" />
    <div class="flex justify-center">
      <van-image
        class="rounded-full"
        :width="parseInt($pxToPxRatio(80), 10)"
        :height="parseInt($pxToPxRatio(80), 10)"
        fit="cover"
        round
        :src="userinfo.headPic || '123'"
        :icon-size="parseInt($pxToPxRatio(80), 10)"
        :error-icon="a5"
        @click="
          () => $router.push('/tabbar/user/set/avatar')
        "
      />
    </div>
    <Space height="10" />
    <div class="flex justify-center">
      <div class="truncate max-w-bai3">
        {{ userinfo.nickName || userinfo.phone }}
      </div>
      <Space width="11" />
      <van-image
        :width="parseInt($pxToPxRatio(18), 10)"
        :height="parseInt($pxToPxRatio(18), 10)"
        fit="cover"
        :src="b2"
      />
    </div>
    <Space height="4" />
    <div class="flex">
      <div
        class="flex-auto flex flex-col items-center"
        @click="
          () => $router.push('/tabbar/user/creator/myFans')
        "
      >
        <div class="text-base">
          {{ creatorInfo.fans || 0 }}
        </div>
        <div class="text-xs text-grayDefault">
          我的粉丝
        </div>
      </div>
      <div class="flex-auto flex flex-col items-center">
        <div class="text-base">
          {{ creatorInfo.praiseNum || 0 }}
        </div>
        <div class="text-xs text-grayDefault">
          我的获赞
        </div>
      </div>
    </div>
    <Space height="30" />
    <div
      class="card px-5 py-5 text-xs2 text-grayTip leading-5 h-60 overflow-y-auto"
    >
      {{
        creatorInfo.descr || '这个人很懒，什么都没有留下'
      }}
    </div>
    <div class="flex mt-6">
      <div
        class="flex-auto flex flex-col items-center"
        @click="
          () => $router.push('/tabbar/user/creator/avatar')
        "
      >
        <Icon
          type="icon-genghuanbeijing"
          size="16"
        />
        <div class="text-xs2 mt-2">
          更换背景
        </div>
      </div>
      <div
        class="flex-auto flex flex-col items-center"
        @click="
          () => $router.push('/tabbar/user/creator/intro')
        "
      >
        <Icon
          type="icon-bianjijieshao"
          size="16"
        />
        <div class="text-xs2 mt-2">
          编辑介绍
        </div>
      </div>
      <div
        class="flex-auto flex flex-col items-center"
        @click="
          () =>
            $router.push('/tabbar/user/creator/recommend')
        "
      >
        <Icon
          type="icon-tuijiancangpin"
          size="16"
        />
        <div class="text-xs2 mt-2">
          推荐藏品
        </div>
      </div>
      <div
        class="flex-auto flex flex-col items-center"
        @click="
          () => $router.push('/tabbar/user/creator/privacy')
        "
      >
        <Icon
          type="icon-zhuyekejian"
          size="16"
        />
        <div class="text-xs2 mt-2">
          主页可见
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import a1 from './images/a1.png';
import a2 from './images/a2.png';
import b2 from '../images/b2.png';
import a5 from '@/assets/images/a5.png';
import {
  computed,
  ref,
  watch,
  watchEffect,
  getCurrentInstance,
} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
let { proxy } = getCurrentInstance();

let store = useStore();
let userinfo = ref({});
store.dispatch('getUserinfo');

watchEffect(() => {
  userinfo.value = store.state.userinfo;
});

let creatorInfo = ref({});
proxy
  .$http('post', '/v1/artist/artistInfo', {})
  .then((res) => {
    creatorInfo.value = res.data;
  })
  .thenError((res) => Toast(res.msg));
</script>
<style lang="less" scoped></style>
