<template>
  <div
    v-if="props.item"
    class="CardStarSimple"
  >
    <van-image
      class="relative z-1 rounded-2xl2 overflow-hidden"
      :src="props.item.logo"
      :width="$pxToVw(345)"
      :height="$pxToVw(150)"
      fit="cover"
      @click="goDetail"
    />
    <div
      class="live"
      @click="switchLive"
    >
      <Icon
        :type="props.item.isLive ? 'icon-dianzan' : 'icon-dianzan2'"
        size="15"
      />
      <Space width="10" />
      <div>{{ props.item.live }}</div>
    </div>
    <div class="bg-gradient-to-b from-white to-redGradient pl-6 pr-4 -mt-4 relative">
      <Space height="29" />
      <div
        class="flex items-center text-base text-blackTitle"
        @click="goDetail"
      >
        <div class=" max-w-bai3 truncate">
          {{ props.item.title }}
        </div>
      </div>
      <Space height="21" />
    </div>
  </div>
</template>
<script setup>
import { defineProps, getCurrentInstance } from 'vue';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
let {proxy} = getCurrentInstance();
let router = useRouter();

const props = defineProps({
  item: Object,
});

let switchLive = proxy.$debounce(() => {
  let switchType = props.item.isLive ? 2 : 1;
  proxy.$http('post', '/v1/friend/userLike', {
    'dcId': props.item.id,
    'likeType': 0,
    'type': switchType,
  })
    .then(res => {
      props.item.isLive = !props.item.isLive;
      if (switchType === 1) {
        props.item.live++;
      } else {
        props.item.live--;
      }
    }).thenError(err => {
      Toast(err.msg);
    });
});

function goDetail() {
  router.push(`/tabbar/home/detail?id=${props.item.id}`);
}
</script>
<style lang="less" scoped>
.CardStarSimple {
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 13px;
  position: relative;
  .live {
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
    letter-spacing: 1px;
  }
}
</style>
