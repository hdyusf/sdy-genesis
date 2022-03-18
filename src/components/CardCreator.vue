<template>
  <div
    v-if="props.item"
    class="CardCreator"
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
      <div
        class="mt-2 flex items-center text-base"
        @click="goCreatorDetail"
      >
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
        <Space width="10" />
        <div class="text-xs text-grayDefault">
          {{ $reducePrice(props.item.fans) }}粉丝
        </div>
      </div>
      <Space height="20" />
      <div
        v-if="!isSelf"
        class="keepButton"
        :class="{active: props.item.follow}"
        @click="switchFollow"
      >
        {{ props.item.follow ? '已关注' : '+关注' }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, getCurrentInstance, computed } from 'vue';
import a5 from '@/assets/images/a5.png';
import { Toast } from 'vant';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
let router = useRouter();
let store = useStore();
let {proxy} = getCurrentInstance();

const props = defineProps({
  item: Object,
  callback: Function,
});

let switchFollow = proxy.$debounce(() => {
  proxy.$http('post', '/v1/friend/operation', {
    'type': props.item.follow ? 2 : 1,
    'userId': props.item.userId,
  })
    .then(res => {
      props.item.follow = !props.item.follow;
    }).thenError(err => {
      Toast(err.msg);
    });
}, 300);

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
}, 300);

let isSelf = computed(() => {
  return props.item.userId === store.state.userinfo?.id;
});

function goDetail() {
  router.push(`/tabbar/home/detail?id=${props.item.id}`);
}

function goCreatorDetail() {
  router.push(`/tabbar/user/creator/show?id=${props.item.userId}`);
}
</script>
<style lang="less" scoped>
.CardCreator {
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 13px;
  position: relative;
  .keepButton {
    padding: 8px 16px;
    background: #ffe5e5;
    border-radius: 18px;
    position: absolute;
    right: 15px;
    bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: #e0260e;
    line-height: 19px;
    letter-spacing: 1px;
    &.active {
      background: #ef4034;
      color: white;
    }
  }
}
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
</style>
