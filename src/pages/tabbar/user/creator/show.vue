<template>
  <div class="relative z-1 pageCard-sm">
    <van-image
      class="w-full absolute top-0 left-0 -z-2"
      :height="parseInt($pxToPxRatio(208), 10)"
      fit="cover"
      :src="creatorInfo?.backImg || '123'"
      :icon-size="parseInt($pxToPxRatio(375), 10)"
      :error-icon="a1"
    />
    <div class="absolute top-28 left-0 w-full h-32 -z-1 px15">
      <div
        class="bg-white/30 w-full h-full rounded-lg2 backdrop-blur-lg shadow-lg"
      />
    </div>
    <Space height="30" />
    <span
      class=" sticky z-3 w-10"
      :style="{top: $pxToPxRatio(15) + 'px'}"
    >
      <div class="flex justify-center items-center rounded-t rounded-b bg-white/30 w-9 h-9">
        <Icon
          type="icon-fanhui"
          size="23"
          @click="() => $router.back()"
        />
      </div>
    </span>
    <Space height="5" />
    <div class="flex justify-center">
      <van-image
        round
        :width="parseInt($pxToPxRatio(80), 10)"
        :height="parseInt($pxToPxRatio(80), 10)"
        fit="cover"
        :src="creatorInfo.headPic || '123'"
        :icon-size="parseInt($pxToPxRatio(80), 10)"
        :error-icon="a5"
      />
    </div>
    <Space height="10" />
    <div class="flex justify-center">
      <div class="truncate max-w-bai3">
        {{ creatorInfo.nickName || '暂无' }}
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
      >
        <div class=" text-base">
          {{ creatorInfo.fans || 0 }}
        </div>
        <div class=" text-xs text-grayDefault">
          粉丝
        </div>
      </div>
      <div class="flex-auto flex flex-col items-center">
        <div class=" text-base">
          {{ creatorInfo.praiseNum || 0 }}
        </div>
        <div class=" text-xs text-grayDefault">
          获赞
        </div>
      </div>
    </div>
    <Space height="30" />
    <div class="card px-5 py-5 text-xs2 text-grayTip leading-5 overflow-y-auto">
      {{ creatorInfo.descr || '这个人很懒，什么都没有留下' }}
    </div>
    <div
      class=" sticky bg-grayBg z-2"
      :style="{top: $pxToPxRatio(0) + 'px'}"
    >
      <Space height="15" />
      <div class="listSelectType">
        <div
          v-for="(item, index) in listArr"
          :key="index"
          class="flex-auto"
          :class="{ 'text-redTitle': listSelect === item.status }"
          @click="() => listSelect = item.status"
        >
          {{ item.title }}
        </div>
      </div>
      <Space height="24" />
      <template v-if="listSelect === 2">
        <div class=" flex items-center text-xs gap-x-2 justify-end">
          <div
            v-for="(item, index) in listArrInner"
            :key="index"
            class=" ring-1 rounded-md px-2 py-1"
            :class="listSelectInner === item.status ? 'text-redTitle ring-redTitle' : 'ring-grayDefault'"
            @click="() => listSelectInner = item.status"
          >
            {{ item.title }}
          </div>
        </div>
        <Space height="15" />
      </template>
    </div>
    <ListView
      ref="listView"
      :get-list="getList"
      empty="暂无数据"
      pull-refresh
    >
      <template #default="{ data }">
        <CardStarSimple
          v-for="(item, index) of data"
          :key="index"
          :item="item"
        />
      </template>
    </ListView>
    <van-popup
      :show="notShowPage"
      :overlay="false"
    />
    <div
      v-if="notShowPage"
      class="fixed z-2 top-0 left-0 w-full h-full bg-white/30 backdrop-blur text-base text-grayTip flex justify-center items-center"
    >
      已关闭查看主页
    </div>
  </div>
</template>
<script setup>
import a5 from '@/assets/images/a5.png';
import { getCurrentInstance, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import b2 from '../images/b2.png';
import a1 from './images/a1.png';
let route = useRoute();
let {proxy} = getCurrentInstance();
let store = useStore();

let notShowPage = ref(false);
proxy.$http('get', '/v1/artist/islook', {
  artistUserId: route.query.id,
})
  .then(res => {
    notShowPage.value = !res.data;
  }).thenError(res => Toast(res.msg));

let listSelect = ref(1);
let listArr = ref([
  {
    title: '作品',
    status: 1,
  },
  {
    title: '藏品',
    status: 2,
  }
]);

let listSelectInner = ref(null);
let listArrInner = ref([
  {
    title: '全部',
    status: null,
  },
  {
    title: '在售',
    status: 0,
  },
  {
    title: '私藏',
    status: 1,
  },
]);

let creatorInfo = ref({});
proxy.$http('get', '/v1/artist/getArtistInfo', {
  artistUserId: route.query.id,
})
  .then(res => {
    creatorInfo.value = res.data;
  }).thenError(res => Toast(res.msg));

async function getList(page) {
  let res = await proxy.$http('post', '/v1/artist/dcList', {
    page: page,
    size: 5,
    'collectionType': listSelectInner.value,
    'type': listSelect.value,
    'userId': route.query.id,
  });
  res.data.list = res.data.list.map((item) => {
    return {
      id: item.id,
      logo: item.fileUrl,
      live: item.likeNum,
      title: item.name,
      type: item.marketType,
      userIcon: item.artistHeadPic,
      userName: item.artistNickName,
      userId: item.artistUserId,
      price: item.price,
      isLive: item.isLike,
    };
  });
  return res;
}
let listView = ref();
watch(
  () => listSelect.value,
  () => {
    listView.value?.reset();
  },
);
watch(
  () => listSelectInner.value,
  () => {
    listView.value?.reset();
  },
);
</script>
<style lang="less" scoped>
</style>
