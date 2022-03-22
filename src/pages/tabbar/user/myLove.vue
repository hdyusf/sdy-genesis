<template>
  <NavBar title="我喜欢的" />
  <div class="pageCard-sm">
    <div
      class=" sticky bg-grayBg z-2"
      :style="{top: $pxToPxRatio(46) + 'px'}"
    >
      <Space height="10" />

      <van-search
        v-model="searchInput"
        class="text-sm"
        shape="round"
        placeholder="搜索作品"
      >
        <template #left-icon>
          <Icon
            type="icon-chakan"
            size="17"
          />
        </template>
      </van-search>
      <Space height="15" />
    </div>
    <ListView
      ref="listView"
      :get-list="getList"
      empty="暂无数据"
      pull-refresh
    >
      <template #default="{ data }">
        <CardStar
          v-for="(item, index) of data"
          v-show="item?.isLive"
          :key="index"
          :item="item"
          :live-callback="liveCallback"
        />
      </template>
    </ListView>
  </div>
</template>
<script setup>
import {
  getCurrentInstance, ref, watch
} from 'vue';

let { proxy } = getCurrentInstance();
const searchInput = ref('');

async function getList(page) {
  let res = await proxy.$http('post', '/v1/dc/dcUserLike', {
    page: page,
    size: 5,
    search: searchInput.value,
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
  () => searchInput.value,
  () => {
    listView.value?.reset();
  },
);
function liveCallback() {
  listView.value?.reset();
}
</script>
<style lang="less" scoped></style>
