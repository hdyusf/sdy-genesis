<template>
  <NavBar
    title="河图数藏"
    :go-back="false"
  />
  <div class="pageCard-sm">
    <div
      class="bg-grayBg sticky z-2"
      :style="{ top: $pxToPxRatio(46) + 'px' }"
    >
      <Space height="10" />
      <van-search
        readonly
        class="text-sm"
        shape="round"
        placeholder="搜索作品/艺术家"
        @click="() => $router.push('/tabbar/search')"
      >
        <template #left-icon>
          <Icon
            type="icon-chakan"
            size="17"
          />
        </template>
      </van-search>
    </div>
    <Space height="15" />
    <van-swipe
      class="rounded-xl overflow-hidden bg-grayDefault"
      :style="{ height: $pxToPxRatio(141) + 'px' }"
      :autoplay="5000"
      indicator-color="white"
    >
      <van-swipe-item
        v-for="item of bannerList"
        :key="item"
      >
        <van-image
          :width="parseInt($pxToPxRatio(345), 10)"
          :height="parseInt($pxToPxRatio(141), 10)"
          fit="cover"
          :src="item.imageUrl"
        />
      </van-swipe-item>
    </van-swipe>
    <Space height="20" />
    <div
      class="relative z-1 flex items-center justify-between h-10 text-center text-white text-sm"
    >
      <van-image
        :height="$pxToPxRatio(40)"
        :width="$pxToPxRatio(196)"
        :src="a5"
        fit="contain"
        class="absolute left-0 top-0 -z-1"
      />
      <van-image
        :height="$pxToPxRatio(40)"
        :width="$pxToPxRatio(196)"
        :src="a6"
        fit="fill"
        class="absolute right-0 top-0 -z-1"
      />
      <div
        class="flex-auto"
        @click="() => $router.push('/tabbar/market?type=0')"
      >
        版权市场
      </div>
      <Space width="21" />
      <div
        class="flex-auto"
        @click="() => $router.push('/tabbar/market?type=1')"
      >
        衍生品市场
      </div>
    </div>
    <div
      class="bg-grayBg sticky z-2"
      :style="{ top: $pxToPxRatio(90) + 'px' }"
    >
      <Space height="18" />
      <div class="listSelectType">
        <div
          v-for="(item, index) in listArr"
          :key="index"
          class="flex-auto"
          :class="{
            'text-redTitle': listSelect === item.status,
          }"
          @click="() => (listSelect = item.status)"
        >
          {{ item.title }}
        </div>
      </div>
      <Space height="20" />
    </div>
    <ListView
      ref="listView"
      :get-list="getList"
      empty="暂无数据"
      pull-refresh
    >
      <template #default="{ data }">
        <component
          :is="listComponentName"
          v-for="(item, index) of data"
          :key="index"
          :item="item"
        />
      </template>
    </ListView>
  </div>
  <div
    class="animate__animated fixed z-1 bottom-24 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center"
    :class="goTopShow ? 'animate__fadeInUp' : 'hidden'"
    @click="goTop"
  >
    <Icon
      type="icon-fanhuidingbu"
      size="21"
    />
  </div>
</template>
<script setup>
import { Toast } from 'vant';
import {
  getCurrentInstance,
  ref,
  watch,
  watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import a5 from './images/a5.png';
import a6 from './images/a6.png';

let { proxy } = getCurrentInstance();
let router = useRouter();

let bannerList = ref([]);
proxy
  .$http('get', '/v1/home/bannerInfo', {
    type: 1,
  })
  .then((res) => {
    bannerList.value = res.data;
  });

let listSelect = ref(1);
let listArr = ref([
  {
    title: '精选系列',
    status: 1,
  },
  {
    title: '人气艺术家',
    status: 2,
  },
]);
let listView = ref(null);
watch(listSelect, () => {
  listView.value.reset();
});
async function getList(page) {
  let res = await proxy.$http('post', '/v1/home/list', {
    page: page,
    size: 5,
    type: listSelect.value,
  });
  if (listSelect.value === 1) {
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
  } else {
    res.data.list = res.data.list.map((item) => {
      return {
        userId: item.userId,
        logo: item.vo.fileUrl,
        title: item.vo.name,
        isLive: item.vo.isLike,
        live: item.vo.likeNum,
        id: item.vo.id,
        userIcon: item.headPic,
        userName: item.nickName,
        fans: item.fans,
        follow: item.isFollow,
      };
    });
  }
  return res;
}
let listComponentName = ref('CardStar');
watchEffect(() => {
  listComponentName.value =
    listSelect.value === 1 ? 'CardStar' : 'CardCreator';
});

let goTopShow = ref(false);
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    goTopShow.value = true;
  } else {
    goTopShow.value = false;
  }
});
function goTop() {
  window.scrollTo(0, 0);
}
</script>
<style lang="less" scoped></style>
