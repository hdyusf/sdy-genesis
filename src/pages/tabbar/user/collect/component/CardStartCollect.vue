<template>
  <div
    v-if="props.item"
    class="CardStar"
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
      <div class="flex items-center text-base text-blackTitle">
        <div class=" max-w-bai3 truncate">
          {{ props.item.title }}
        </div>
        <van-image
          v-if="props.item.type === 0"
          class="w-4 h-4 ml-1"
          :src="z2"
          fit="contain"
        />
        <van-image
          v-if="props.item.type === 1"
          class="w-4 h-4 ml-1"
          :src="z4"
          fit="contain"
        />
      </div>
      <div class="mt-2 flex items-center text-base">
        <van-image
          class="w-4.5 h-4.5 ml-1"
          round
          :src="props.item.userIcon"
          :icon-size="parseInt($pxToPxRatio(18), 10)"
          :error-icon="a5"
          fit="cover"
        />
        <Space width="10" />
        <div class="text-xs text-grayDefault max-w-bai3 truncate">
          {{ props.item.userName }}
        </div>
      </div>
      <div class=" absolute right-6 bottom-5 text-xs text-grayDefault">
        数量：x{{ props.item.number }}
      </div>
      <Space height="20" />
    </div>
  </div>
</template>
<script setup>
import { defineProps, getCurrentInstance } from 'vue';
import z2 from '@/assets/images/z2.png';
import z4 from '@/assets/images/z4.png';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
let {proxy} = getCurrentInstance();
let router = useRouter();

const props = defineProps({
  item: Object,
  type: Number,
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
  let type = 'sell';
  if (props.type === 0) {
    type = 'sell';
  } else {
    type = 'collect';
  }
  router.push(
    `/tabbar/home/detail?id=${props.item.id}&type=${type}`,
  );
}
</script>
<style lang="less" scoped>
.CardStar {
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
