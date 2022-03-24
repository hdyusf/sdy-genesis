<template>
  <div
    v-if="props.item"
    class="CardStar"
  >
    <van-image
      class="relative z-1 rounded-2xl2 overflow-hidden"
      :src="props.item.logo"
      :width="$pxToVw(345)"
      :height="$pxToVw(345)"
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
      <div
        class="mt-2 flex items-center text-base"
        @click="goCreatorDetail"
      >
        <van-image
          class="w-4.5 h-4.5 ml-1"
          round
          :src="props.item.userIcon || '123'"
          :icon-size="parseInt($pxToPxRatio(18), 10)"
          :error-icon="a5"
          fit="cover"
        />
        <Space width="10" />
        <div class="text-xs text-grayDefault max-w-bai3 truncate">
          {{ props.item.userName || '---' }}
        </div>
      </div>
      <Space height="20" />
      <div
        class="absolute right-4 bottom-4 px-4 py-2 bg-[#ffe5e5] rounded-2xl1 text-redTitle font-semibold tracking-wide text-xs2"
        @click="goDetail"
      >
        ¥ {{ $priceFilter(props.item.price, 2, true) }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, getCurrentInstance } from 'vue';
import z2 from '@/assets/images/z2.png';
import z4 from '@/assets/images/z4.png';
import a5 from '@/assets/images/a5.png';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
let {proxy} = getCurrentInstance();
let router = useRouter();

const props = defineProps({
  item: Object,
  liveCallback: Function,
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
      props.liveCallback && props.liveCallback();
    }).thenError(err => {
      Toast(err.msg);
    });
});

function goDetail() {
  router.push(`/tabbar/home/detail?id=${props.item.id}`);
}

function goCreatorDetail() {
  router.push(`/tabbar/user/creator/show?id=${props.item.userId}`);
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
