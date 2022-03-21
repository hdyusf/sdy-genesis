<template>
  <NavBar
    title="我的关注"
  />
  <div class=" pageCard-sm">
    <Space height="15" />
    <ListView
      ref="listView"
      :get-list="getList"
      empty="暂无数据"
      pull-refresh
    >
      <template #default="{ data }">
        <div class="grid gap-4 grid-cols-2 px-4">
          <div
            v-for="(item, index) of data"
            :key="index"
            class="flex flex-col items-center justify-center bg-white rounded-lg2 py-5"
          >
            <Space height="8" />
            <van-image
              round
              :width="parseInt($pxToPxRatio(70), 10)"
              :height="parseInt($pxToPxRatio(70), 10)"
              fit="contain"
              :src="item.icon || '123'"
              :icon-size="parseInt($pxToPxRatio(80), 10)"
              :error-icon="a5"
              @click="() => goCreatorDetail(item.id)"
            />
            <Space height="12" />
            <div
              class=" text-base"
              @click="() => goCreatorDetail(item.id)"
            >
              {{ item.name }}
            </div>
            <Space height="4" />
            <div class=" text-xs2 text-grayDefault">
              {{ item.fans }} 粉丝
            </div>
            <Space height="13" />
            <div
              class=" text-sm text-redTitle px-4 py-1 bg-red-100 rounded-full"
              @click="() => unfollow(item.id)"
            >
              取消关注
            </div>
          </div>
        </div>
      </template>
    </ListView>
  </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { ref, getCurrentInstance } from 'vue';
import a5 from '@/assets/images/a5.png';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
let {proxy} = getCurrentInstance();
let store = useStore();
let router = useRouter();

async function getList(page) {
  let res = await proxy.$http('post', '/v1/friend/list', {
    page: page,
    size: 10,
    type: 1,
  });
  res.data.list = res.data.list.map((item) => {
    return {
      id: item.userId,
      icon: item.headPic,
      name: item.nickName,
      fans: item.fans,
    };
  });

  return res;
}

let listView = ref();
let unfollow = proxy.$debounce((id) => {
  proxy.$http('post', '/v1/friend/operation', {
    'type': 2,
    'userId': id,
  })
    .then(res => {
      Toast('已取消关注');
      listView.value.reset();
    }).thenError(err => {
      Toast(err.msg);
    });
}, 300);

function goCreatorDetail(id) {
  router.push(`/tabbar/user/creator/show?id=${id}`);
}

</script>
<style lang="less" scoped>
</style>
