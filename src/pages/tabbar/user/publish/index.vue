<template>
  <NavBar title="我发布的" />
  <div
    class="sticky bg-grayBg z-2"
    :style="{ top: $pxToPxRatio(46) + 'px' }"
  >
    <div
      class="listSelectType bg-white"
      :class="{ more: listArr.length > 4 }"
    >
      <div class="moreXScroll">
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
    </div>
  </div>
  <div class="pageCard-sm">
    <Space height="15" />
    <ListView
      ref="listView"
      :get-list="getList"
      empty="暂无数据"
      pull-refresh
    >
      <template #default="{ data }">
        <OrderCard
          v-for="item of data"
          :key="item"
          :item="item"
          :list-view="listView"
          :no-detail="item.status === '被锁定'"
        />
      </template>
    </ListView>
  </div>
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
import { useStore } from 'vuex';
import OrderCard from '../component/OrderCard.vue';
let { proxy } = getCurrentInstance();
let store = useStore();

let listSelect = ref(null);
let listArr = ref([
  {
    title: '全部',
    status: null,
  },
  {
    title: '审核中',
    status: 1,
  },
  {
    title: '发布中',
    status: 4,
  },
  {
    title: '已售罄',
    status: 7,
  },
  {
    title: '已取消',
    status: 0,
  },
  {
    title: '被拒绝',
    status: 3,
  },
  {
    title: '被锁定',
    status: 6,
  },
]);
if (proxy.$route.query.type) {
  listSelect.value = +proxy.$route.query.type;
}

async function getList(page) {
  let res = await proxy.$http('post', '/v1/dc/saleRecord', {
    page: page,
    size: 5,
    status: listSelect.value,
  });
  res.data.list = res.data.list.map((item) => {
    return {
      ...item,
      id: item.id,
      title: item.name,
      price: item.price,
      img: item.fileUrl,
      user: store.state.userinfo.nickName,
      userId: store.state.userinfo.id,
      number: item.deriveStock || 0,
      status: (() => {
        let a = listArr.value.find((fi) => {
          if (item.status === 2) {
            return fi.status === 1;
          }
          if (item.status === 5) {
            return fi.status === 0;
          }
          return fi.status === item.status;
        });
        return a.title;
      })(),
      orderId: item.id,
      time: item.createTime,
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
</script>
<style lang="less" scoped></style>
