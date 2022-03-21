<template>
  <div class=" relative z-1 bg-grayBg">
    <van-image
      class="w-full"
      :height="parseInt($pxToPxRatio(235), 10)"
      fit="cover"
      :src="a1"
    />
    <div class="absolute left-0 top-0 z-1 w-full">
      <van-image
        v-if="creator"
        class="creatorProve absolute right-1 top-7"
        :width="parseInt($pxToPxRatio(77), 10)"
        :height="parseInt($pxToPxRatio(77), 10)"
        fit="cover"
        :src="b1"
        @click="() => router.push('/tabbar/user/creator')"
      />
      <Space height="67" />
      <div class="flex px-9 items-end">
        <van-image
          class="rounded-full"
          :width="parseInt($pxToPxRatio(80), 10)"
          :height="parseInt($pxToPxRatio(80), 10)"
          fit="cover"
          round
          :src="userinfo.headPic || '123'"
          :icon-size="parseInt($pxToPxRatio(80), 10)"
          :error-icon="a2"
          @click="() => $router.push('/tabbar/user/set/avatar')"
        />
        <div class="flex flex-auto">
          <div
            class="flex-auto text-center"
            @click="() => $router.push('/tabbar/user/myKeep')"
          >
            <div class="text-base">
              {{ userinfo.follow || 0 }}
            </div>
            <div class="text-grayDefault text-xs">
              我的关注
            </div>
          </div>
          <div
            class="flex-auto text-center"
            @click="() => $router.push('/tabbar/user/myLove')"
          >
            <div class="text-base">
              {{ userinfo.likeNum || 0 }}
            </div>
            <div class="text-grayDefault text-xs">
              我的喜欢
            </div>
          </div>
        </div>
      </div>
      <Space height="18" />
      <div
        class="flex px-10"
        @click="() => $router.push('/tabbar/user/set')"
      >
        <div class="flex-auto">
          <div class="flex items-start">
            <div class="text-blackTitle text-base truncate max-w-bai3">
              {{ userinfo.nickName || userinfo.phone }}
            </div>
            <van-image
              v-if="creator"
              class="ml-2"
              :width="parseInt($pxToPxRatio(19), 10)"
              :height="parseInt($pxToPxRatio(19), 10)"
              fit="cover"
              :src="b2"
            />
          </div>
          <Space height="8" />
          <div class="text-xs2 text-grayTip truncate w-52">
            {{ userinfo.descr || ' 他好像对元宇宙没什么了解' }}
          </div>
        </div>
        <div class="flex flex-shrink-0 items-center">
          <Icon
            type="icon-gengduo"
            size="20"
          />
        </div>
      </div>
    </div>
    <Space height="4" />
    <div class="grid gap-4 grid-cols-2 px-4">
      <template
        v-for="(item, index) of list"
        :key="index"
      >
        <div
          v-if="creator ? item.creator : item.default"
          class="flex flex-col items-center justify-center bg-white rounded-lg2 py-5"
          @click="() => clickCard(item)"
        >
          <van-image
            :width="parseInt($pxToPxRatio(56), 10)"
            :height="parseInt($pxToPxRatio(56), 10)"
            fit="contain"
            :src="item.icon"
          />
          <div class="mt-1 text-sm">
            {{ item.title }}
          </div>
        </div>
      </template>
    </div>
    <Space height="10" />
  </div>
</template>
<script setup>
import a1 from './images/a1.png';
import a2 from './images/a2.png';
import a3 from './images/a3.png';
import a4 from './images/a4.png';
import a5 from './images/a5.png';
import a6 from './images/a6.png';
import a7 from './images/a7.png';
import a8 from './images/a8.png';
import b1 from './images/b1.png';
import b2 from './images/b2.png';
import b3 from './images/b3.png';
import { computed, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Toast } from 'vant';
let store = useStore();
let userinfo = ref(store.state.userinfo || {});
store.dispatch('getUserinfo');

watchEffect(() => {
  userinfo.value = store.state.userinfo;
});

let router = useRouter();

let list = ref([
  {
    icon: a4,
    title: '我的藏品',
    href: '/tabbar/user/collect',
    default: true,
    creator: true,
    auth: false,
  },
  {
    icon: a5,
    title: '我的钱包',
    href: '/tabbar/user/wallet',
    default: true,
    creator: true,
    auth: false,
  },
  {
    icon: a6,
    title: '我买到的',
    href: '/tabbar/user/buy',
    default: true,
    creator: true,
    auth: false,
  },
  {
    icon: a8,
    title: '我出售的',
    href: '/tabbar/user/sell',
    default: true,
    creator: true,
    auth: false,
  },
  {
    icon: a7,
    title: '我发布的',
    href: '/tabbar/user/publish',
    default: true,
    creator: true,
    auth: false,
  },
  {
    icon: a3,
    title: '成为艺术家',
    href: '/tabbar/user/contract',
    default: true,
    creator: false,
    auth: true,
  },
  {
    icon: b3,
    title: '铸造NFT',
    href: '/tabbar/user/createNFT',
    default: false,
    creator: true,
    auth: true,
  },
]);

let creator = computed(() => {
  return userinfo.value.level;
});

async function clickCard(item) {
  if (item.auth) {
    let userinfo = await store.dispatch('getUserinfo');
    if (!userinfo.isAuth) {
      Toast('请先实名认证');
      return;
    }
  }
  router.push(item.href);
}
</script>
<style lang="less" scoped>
</style>

