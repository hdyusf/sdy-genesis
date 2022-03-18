<template>
  <NavBar />
  <div class=" pageCard-sm">
    <div
      class=" sticky bg-grayBg z-2"
      :style="{top: $pxToPxRatio(46) + 'px'}"
    >
      <Space height="10" />
      <van-search
        v-model="searchInput"
        class="text-sm"
        shape="round"
        placeholder="搜索作品/艺术家"
        @blur="searchBlur"
      >
        <template #left-icon>
          <Icon
            type="icon-chakan"
            size="17"
          />
        </template>
      </van-search>
    </div>
    <template v-if="!searchInput">
      <Space height="25" />
      <template v-if="searchHistoryList.length">
        <div class="text-xs2">
          搜索历史：
        </div>
        <Space height="15" />
        <div class="flex flex-wrap flex-shrink-0 text-xs2 gap-2.5">
          <div
            v-for="item of searchHistoryList"
            :key="item"
            class="px-2 py-1 bg-gray-200/70 rounded-full min-w-3 text-center"
            @click="() => (searchInput = item)"
          >
            {{ item }}
          </div>
        </div>
        <Space height="35" />
      </template>
      <div class="text-xs2">
        热门推荐：
      </div>
      <Space height="15" />
      <div class="flex flex-wrap flex-shrink-0 text-xs2 gap-2.5">
        <div
          v-for="item of hotList"
          :key="item"
          class="px-2 py-1 bg-gray-200/70 rounded-full min-w-3 text-center"
          @click="() => clickHot(item)"
        >
          {{ item }}
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class=" sticky bg-grayBg z-2"
        :style="{top: $pxToPxRatio(90) + 'px'}"
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
    </template>
  </div>
</template>
<script setup>
import a3 from '@/assets/images/a3.png';
import a4 from '@/assets/images/a4.png';
import b1 from '@/assets/images/b1.png';
import b2 from '@/assets/images/b2.png';
import b3 from '@/assets/images/b3.png';
import {
  ref,
  watchEffect,
  computed,
  watch,
  getCurrentInstance,
} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

let { proxy } = getCurrentInstance();
let router = useRouter();

const searchInput = ref('');

let listSelect = ref(1);
let listArr = ref([
  {
    title: '藏品',
    status: 1,
  },
  {
    title: '艺术家',
    status: 2,
  }
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
        userIcon: item.artistHeadPic || a3,
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

let hotList = ref(['Adobe系列', '创小猿', '风起洛阳']);
function clickHot(item) {
  searchInput.value = item;
  searchBlur();
}

let searchHistoryList = ref(['']);
searchHistoryList.value = JSON.parse(localStorage.getItem('searchHistoryList')) || [];
function searchBlur() {
  if (!searchInput.value || !searchInput.value.trim()) return;
  const index = searchHistoryList.value.indexOf(searchInput.value);
  if (index !== -1) {
    searchHistoryList.value.splice(index, 1);
  }
  searchHistoryList.value.push(searchInput.value);
  localStorage.searchHistoryList = JSON.stringify(searchHistoryList.value);
}
</script>
<style lang="less" scoped>
</style>
