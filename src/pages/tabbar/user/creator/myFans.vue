<template>
  <NavBar
    title="我的粉丝"
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
              :src="item.icon"
            />
            <Space height="12" />
            <div class=" text-base">
              {{ item.name }}
            </div>
            <Space height="4" />
            <div class=" text-xs2 text-grayDefault">
              {{ item.fans }} 粉丝
            </div>
            <Space height="13" />
            <template v-if="item.level === 0">
              <Space height="28" />
            </template>
            <template v-else>
              <div
                v-if="item.hu"
                class=" text-sm text-redTitle px-4 py-1 bg-red-100 rounded-full"
                @click="() => switchFollow(item)"
              >
                取消关注
              </div>
              <div
                v-else
                class=" text-sm text-redTitle px-4 py-1 bg-red-100 rounded-full"
                @click="() => switchFollow(item)"
              >
                互相关注
              </div>
            </template>
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
let {proxy} = getCurrentInstance();
let store = useStore();

async function getList(page) {
  let res = await proxy.$http('post', '/v1/friend/list', {
    page: page,
    size: 10,
    type: 2,
  });
  res.data.list = res.data.list.map((item) => {
    return {
      id: item.userId,
      icon: item.headPic || a5,
      name: item.nickName,
      fans: item.fansNum,
      hu: item.isEachOther,
      level: item.level,
    };
  });

  return res;
}

let switchFollow = proxy.$debounce((item) => {
  proxy.$http('post', '/v1/friend/operation', {
    'type': item.hu ? 2 : 1,
    'userId': item.id,
  })
    .then(res => {
      if (item.hu) {
        item.fans-=1;
      } else {
        item.fans+=1;
      }
      item.hu = !item.hu;
    }).thenError(err => {
      Toast(err.msg);
    });
});

</script>
<style lang="less" scoped>
</style>
