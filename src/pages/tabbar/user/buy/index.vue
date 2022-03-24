<template>
  <NavBar title="我买到的" />
  <div
    class="sticky bg-grayBg z-2"
    :style="{ top: $pxToPxRatio(46) + 'px' }"
  >
    <div class="listSelectType bg-white px-6 pt-2 pb-4">
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
          v-for="(item) of data"
          :key="item"
          :item="item"
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
import dayjs from 'dayjs';
let { proxy } = getCurrentInstance();
let store = useStore();

let listSelect = ref(null);
let listArr = ref([
  {
    title: '全部',
    status: null,
  },
  {
    title: '待付款',
    status: 0,
  },
  {
    title: '已完成',
    status: 1,
  },
  {
    title: '已取消',
    status: 2,
  },
]);

async function getList(page) {
  let res = await proxy.$http('post', '/v1/order/buyList', {
    page: page,
    size: 5,
    status: listSelect.value,
  });
  res.data.list = res.data.list.map((item) => {
    return {
      id: item.id,
      title: item.name,
      price: item.orderMoney,
      img: item.fileUrl,
      user: item.createNickName,
      userId: item.createUserId,
      number: item.buyCount || 1,
      status: (() => {
        let a = listArr.value.find((fi) => {
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
<style lang="less" scoped>
</style>
