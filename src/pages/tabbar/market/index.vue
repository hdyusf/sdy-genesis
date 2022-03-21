<template>
  <NavBar
    title="市场"
    :go-back="false"
  />
  <div class="pageCard-sm">
    <div
      class="sticky bg-grayBg z-2"
      :style="{ top: $pxToPxRatio(46) + 'px' }"
    >
      <Space height="10" />
      <van-search
        v-model="search"
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
    <van-divider class="my-0 w-screen -ml-4" />
    <div
      class="flex items-center text-xs2 py-2 text-black2"
    >
      <div
        class="flex items-center gap-1"
        @click="switchTime"
      >
        时间
        <Icon
          type="icon-paixu"
          size="11"
        />
      </div>
      <div
        class="flex items-center gap-1 ml-8"
        @click="switchPrice"
      >
        价格
        <Icon
          type="icon-paixu"
          size="11"
        />
      </div>
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
    </div>
    <van-divider class="my-0 w-screen -ml-4" />
    <Space height="10" />
    <div
      class="flex items-center py-1 text-xs2 text-black2 overflow-auto"
    >
      <div class="flex-shrink-0">
        热门推荐：
      </div>
      <div
        class="flex flex-auto overflow-auto flex-shrink-0"
      >
        <div
          v-for="item of hotList"
          :key="item"
          class="px-2 py-1 bg-gray-200/70 rounded-full ml-2.5"
          @click="() => (hot = item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div
      v-if="searchKeysList.length"
      class="sticky bg-grayBg z-2"
      :style="{ top: $pxToPxRatio(97) + 'px' }"
    >
      <div class="flex items-center overflow-x-auto overflow-y-visible flex-nowrap pt-4">
        <div
          v-for="(item, index) of searchKeysList.concat().reverse()"
          v-show="item.title"
          :key="item"
          class="relative px-4 py-1 bg-[#FFE5E5] rounded mr-4 text-xs text-redTitle flex-shrink-0 "
        >
          {{ item.title }}
          <Icon
            class="absolute -right-1.5 -top-1.5 z-1"
            type="icon-shaixuan-guanbi"
            size="14"
            @click="() => removeSearchKey(index)"
          />
        </div>
      </div>
      <Space height="15" />
    </div>
    <Space
      v-else
      height="15"
    />
    <div class="listBox">
      <ListView
        ref="listView"
        :get-list="getList"
        empty="暂无数据"
        empty-class=" pb-0"
        pull-refresh
      >
        <template #default="{ data }">
          <CardStar
            v-for="(item, index) of data"
            :key="index"
            :item="item"
          />
        </template>
      </ListView>
    </div>
  </div>
  <van-popup
    v-model:show="filter"
    position="right"
    :round="true"
    :style="{ width: $pxToVw(337), height: '100%' }"
  >
    <div class="px-5">
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
      <div class="flex gap-x-3">
        <div
          v-for="(item, index) of attrList"
          :key="index"
          class="filterButton flex items-center justify-center bg-gray-200/70 rounded-full text-xs2 flex-auto h-9 border-1 border-transparent"
          :class="{
            active: item.status === attrListActive,
          }"
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
      <div class="flex gap-x-3">
        <div
          v-for="(item, index) of typeList"
          :key="index"
          class="filterButton flex items-center justify-center bg-gray-200/70 rounded-full text-xs2 flex-auto h-9 border-1 border-transparent"
          :class="{
            active: item.status === typeListActive,
          }"
          @click="() => (typeListActive = item.status)"
        >
          {{ item.title }}
        </div>
      </div>
      <Space height="35" />
      <div class="text-sm font-semibold">
        状态
      </div>
      <Space height="21" />
      <div class="flex gap-x-3">
        <div
          v-for="(item, index) of statusList"
          :key="index"
          class="filterButton flex items-center justify-center bg-gray-200/70 rounded-full text-xs2 flex-auto h-9 border-1 border-transparent"
          :class="{
            active: item.status === statusListActive,
          }"
          @click="() => (statusListActive = item.status)"
        >
          {{ item.title }}
        </div>
      </div>
      <Space height="150" />
      <div class="relative ring-1 rounded-3xl ring-redLine flex justify-end">
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
import { ref, watch, getCurrentInstance } from 'vue';
import a2 from '@/assets/images/a2.png';
import a3 from '@/assets/images/a3.png';
import a4 from '@/assets/images/a4.png';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
let { proxy } = getCurrentInstance();

let router = useRouter();
let route = useRoute();

let searchKeysList = ref([]);
let search = ref('');
watch(
  () => search.value,
  () => {
    listView.value?.reset();
  },
);

let time = ref(0);
function switchTime() {
  time.value = (time.value + 1) % 3;
}
watch(
  () => time.value,
  () => {
    updateSearchKeyTitle(
      'time',
      time.value === 0
        ? ''
        : time.value === 1
          ? '时间升'
          : '时间降',
    );
    listView.value?.reset();
  },
);
let price = ref(0);
function switchPrice() {
  price.value = (price.value + 1) % 3;
}
watch(
  () => price.value,
  () => {
    updateSearchKeyTitle(
      'price',
      price.value === 0
        ? ''
        : price.value === 1
          ? '价格升'
          : '价格降',
    );
    listView.value?.reset();
  },
);
let hot = ref('');
watch(
  () => hot.value,
  () => {
    updateSearchKeyTitle('hot', hot.value);
    listView.value?.reset();
  },
);
let hotList = ref(['Adobe系列', '创小猿', '风起洛阳']);

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
if (route.query.type !== undefined) {
  attrListActive.value = +route.query.type;
  updateSearchKeyTitle(
    'attr',
    attrList.value.find(
      (item) => item.status === attrListActive.value,
    )?.title,
  );
}


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

let statusList = ref([
  {
    title: '全部',
    status: null,
  },
  {
    title: '在售',
    status: 0,
  },
  {
    title: '售罄',
    status: 1,
  },
]);
let statusListActive = ref(null);

function resetFilter() {
  attrListActive.value = null;
  typeListActive.value = null;
  statusListActive.value = null;
}
function submitFilter() {
  filter.value = false;
  listView.value?.reset();
  updateSearchKeyTitle(
    'attr',
    attrList.value.find(
      (item) => item.status === attrListActive.value,
    )?.title,
  );
  updateSearchKeyTitle(
    'type',
    typeList.value.find(
      (item) => item.status === typeListActive.value,
    )?.title,
  );
  updateSearchKeyTitle(
    'status',
    statusList.value.find(
      (item) => item.status === statusListActive.value,
    )?.title,
  );
}

function removeSearchKey(reverseIndex) {
  let index = (searchKeysList.value.length - 1) - reverseIndex;
  let type = searchKeysList.value[index].type;
  searchKeysList.value.splice(index, 1);
  if (type === 'attr') {
    attrListActive.value = null;
  } else if (type === 'type') {
    typeListActive.value = null;
  } else if (type === 'status') {
    statusListActive.value = null;
  } else if (type === 'hot') {
    hot.value = '';
  } else if (type === 'time') {
    time.value = 0;
  } else if (type === 'price') {
    price.value = 0;
  }
  listView.value?.reset();
}
function updateSearchKeyTitle(type, title) {
  if (title === '全部') return;
  let findIndex = searchKeysList.value.findIndex(
    (item) => item.type === type,
  );
  if (findIndex !== -1) {
    searchKeysList.value[findIndex].title = title;
  } else {
    searchKeysList.value.push({
      type: type,
      title: title,
    });
  }
}

async function getList(page) {
  let res = await proxy.$http('post', '/v1/dc/dcBazaar', {
    page: page,
    size: 8,
    isSellOut: statusListActive.value,
    marketType: attrListActive.value,
    priceSort: price.value - 1 < 0 ? '' : price.value - 1,
    recommend: hot.value,
    search: search.value,
    seriesType: typeListActive.value,
    timeSort: time.value - 1 < 0 ? '' : time.value - 1,
  });
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
  return res;
}
let listView = ref();
// watch(
//   () => listSelect.value,
//   () => {
//     listView.value?.reset();
//   },
// );
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
