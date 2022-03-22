<template>
  <NavBar title="推荐藏品" />
  <div class="pageCard-sm">
    <Space height="15" />
    <div
      class="sticky bg-grayBg z-2"
      :style="{ top: $pxToPxRatio(47) + 'px' }"
    >
      <div
        class="w-full py-1.5 bg-[#FFE4CD] text-[#FF7400] flex justify-center ring-1 ring-[#FF7400]"
      >
        此商品用于首页推荐艺术家展示
      </div>
    </div>
    <Space height="15" />
    <van-radio-group v-model="select">
      <ListView
        ref="listView"
        :get-list="getList"
        empty="暂无数据"
        pull-refresh
      >
        <template #default="{ data }">
          <div class="grid gap-y-2.5 gap-x-5 grid-cols-2">
            <div
              v-for="(item, index) of data"
              :key="index"
              class="flex flex-col items-center justify-center rounded-lg2 overflow-hidden relative"
              @click="() => (select = index)"
            >
              <div
                class="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-b from-white to-[#FFEDED] -z-1"
              />
              <van-image
                class="w-full rounded-lg2 overflow-hidden"
                :height="parseInt($pxToPxRatio(150), 10)"
                fit="cover"
                :src="item.icon"
              />
              <Space height="9" />
              <div class="text-sm px-2.5 flex items-center">
                <div
                  class="van-multi-ellipsis--l2 font-semibold"
                >
                  {{ item.title }}
                </div>
                <van-radio
                  :name="index"
                  class="flex-shrink-0 ml-2"
                >
                  <template #icon="props">
                    <Space height="5" />
                    <van-image
                      :width="
                        parseInt($pxToPxRatio(14), 10)
                      "
                      :height="
                        parseInt($pxToPxRatio(14), 10)
                      "
                      fit="cover"
                      :src="props.checked ? d1 : d2"
                    />
                  </template>
                </van-radio>
              </div>
              <Space height="8" />
            </div>
          </div>
        </template>
      </ListView>
    </van-radio-group>
    <Space height="100" />
  </div>
  <div class="fixedBottomButton">
    <van-button
      type="danger"
      block
      round
      :loading="loading"
      @click="submit"
    >
      保存
    </van-button>
  </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { ref, watch, getCurrentInstance } from 'vue';
import d1 from './images/d1.png';
import d2 from './images/d2.png';
import { Toast } from 'vant';
let { proxy } = getCurrentInstance();

let select = ref(0);

async function getList(page) {
  let res = await proxy.$http(
    'post',
    '/v1/artist/recommendDcList',
    {
      page: page,
      size: 10,
    },
  );
  res.data.list = res.data.list.map((item) => {
    return {
      id: item.id,
      icon: item.fileUrl,
      title: item.name,
    };
  });
  return res;
}
let listView = ref();

let loading = ref(false);
let submit = proxy.$debounce(() => {
  loading.value = true;
  proxy
    .$http('post', '/v1/artist/modifyRecommend', {
      dcId: listView.value?.list[select.value].id,
    })
    .then((res) => {
      Toast('修改成功');
      listView.value?.reset();
      select.value = 0;
    })
    .thenError((res) => {
      Toast(res.msg);
    }).all(res => {
      loading.value = false;
    });
});
</script>
<style lang="less" scoped></style>
