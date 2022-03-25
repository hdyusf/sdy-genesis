<template>
  <NavBar title="我的藏品">
    <template #right>
      <div
        class="flex items-center flex-auto justify-end"
        @click="() => (filter = true)"
      >
        筛选
        <Icon
          type="icon-shaixuan34"
          size="17"
        />
      </div>
    </template>
  </NavBar>
  <div class="pageCard-sm">
    <div
      class=" sticky bg-grayBg z-2"
      :style="{top: $pxToPxRatio(46) + 'px'}"
    >
      <Space height="15" />
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
      <Space height="19" />
    </div>
    <ListView
      ref="listView"
      :get-list="getList"
      empty="暂无数据"
      pull-refresh
    >
      <template #default="{ data }">
        <CardStartCollect
          v-for="(item, index) of data"
          :key="index"
          :item="item"
          :type="listSelect"
        />
      </template>
    </ListView>
  </div>
  <van-popup
    v-model:show="filter"
    position="right"
    :round="true"
    :style="{ width: $pxToVw(337), height: '100%' }"
  >
    <div class="px-5 h-full relative">
      <Space height="56" />
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold">
          全部筛选
        </div>
        <Icon
          type="icon-guanbi"
          size="23"
          @click="() => (filter = false)"
        />
      </div>
      <Space height="43" />
      <div class="text-sm font-semibold">
        权益属性
      </div>
      <Space height="21" />
      <div class="grid grid-cols-3 gap-x-3">
        <div
          v-for="(item, index) of attrList"
          :key="index"
          class="filterButton flex items-center justify-center bg-gray-200/70 rounded-full text-xs2 flex-auto h-9 border-1 border-transparent"
          :class="{ active: item.status === attrListActive }"
          @click="() => (attrListActive = item.status)"
        >
          {{ item.title }}
        </div>
      </div>
      <Space height="35" />
      <div class="text-sm font-semibold">
        类型
      </div>
      <Space height="21" />
      <div class="grid grid-cols-3 gap-x-3">
        <div
          v-for="(item, index) of typeList"
          :key="index"
          class="filterButton flex items-center justify-center bg-gray-200/70 rounded-full text-xs2 flex-auto h-9 border-1 border-transparent"
          :class="{ active: item.status === typeListActive }"
          @click="() => (typeListActive = item.status)"
        >
          {{ item.title }}
        </div>
      </div>
      <Space height="95" />
      <div
        class="ring-1 rounded-3xl ring-redLine absolute bottom-10"
      >
        <van-image
          :width="parseInt($pxToPxRatio(300), 10)"
          :height="parseInt($pxToPxRatio(40), 10)"
          fit="fill"
          :src="a2"
        />
        <div
          class="flex items-center justify-between absolute left-0 top-0 z-1 w-full h-full text-xs2"
        >
          <div
            class="flex-auto flex justify-center text-redLine"
            @click="resetFilter"
          >
            重置
          </div>
          <div
            class="flex-auto flex justify-center text-white"
            @click="submitFilter"
          >
            确定
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script setup>
import {
  ref,
  watchEffect,
  computed,
  defineProps,
  watch,
  getCurrentInstance,
} from 'vue';
import a2 from '@/assets/images/a2.png';
import CardStartCollect from './component/CardStartCollect.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
let { proxy } = getCurrentInstance();
let store = useStore();
let router = useRouter();

let listSelect = ref(0);
let listArr = ref([
  {
    title: '在售',
    status: 0,
  },
  {
    title: '私藏',
    status: 1,
  },
]);

let filter = ref(false);
let attrList = ref([
  {
    title: '全部',
    status: null,
  },
  {
    title: '衍生品',
    status: 1,
  },
  {
    title: '版权品',
    status: 0,
  },
]);
let attrListActive = ref(null);

let typeList = ref([
  {
    title: '全部',
    status: null,
  },
  {
    title: '单品',
    status: 0,
  },
  {
    title: '系列',
    status: 1,
  },
]);
let typeListActive = ref(null);

function resetFilter() {
  attrListActive.value = null;
  typeListActive.value = null;
}

async function getList(page) {
  let res = await proxy.$http('post', '/v1/dc/dcTreasure', {
    page: page,
    size: 5,
    isPrivate: listSelect.value,
    marketType: attrListActive.value,
    seriesType: typeListActive.value,
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
      price: item.price,
      isLive: item.isLike,
      number: item.deriveStock || 1,
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

let submitFilter = proxy.$debounce(() => {
  listView.value?.reset();
  filter.value = false;
});
</script>
<style lang="less" scoped>
.filterButton {
  &.active {
    background: #ffe5e5;
    border-radius: 18px;
    border: 1px solid #cf1818;
    color: #cc0909;
  }
}
</style>
