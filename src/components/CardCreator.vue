<template>
  <div
    v-if="props.item"
    class="CardCreator"
  >
    <div class="relative rounded-2xl2 overflow-hidden">
      <van-image
        class="relative z-1 rounded-2xl2 overflow-hidden"
        :src="props.item.logo"
        :width="$pxToVw(345)"
        :height="$pxToVw(150)"
        fit="cover"
        @click="goDetail"
      />
      <div
        class="absolute bottom-0 left-0 z-1 w-full text-base font-semibold flex items-center text-white bg-black/60 px-8 h-10"
        @click="goDetail"
      >
        <div class="max-w-bai3 truncate">
          {{ props.item.title }}
        </div>
      </div>
    </div>
    <div
      class="live"
      @click="switchLive"
    >
      <Icon
        :type="
          props.item.isLive
            ? 'icon-dianzan'
            : 'icon-dianzan2'
        "
        size="15"
      />
      <Space width="10" />
      <div>{{ props.item.live }}</div>
    </div>
    <div
      class="bg-gradient-to-b from-white to-redGradient pl-6 pr-4 -mt-4 relative"
    >
      <div
        class="flex items-center text-base pt-9 pb-5"
        @click="goCreatorDetail"
      >
        <van-image
          class="ml-1"
          round
          :width="parseInt($pxToPxRatio(30), 10)"
          :height="parseInt($pxToPxRatio(30), 10)"
          :src="props.item.userIcon || '123'"
          :icon-size="parseInt($pxToPxRatio(30), 10)"
          :error-icon="a5"
          fit="cover"
        />
        <Space width="10" />
        <div
          class="text-base font-semibold max-w-bai3 truncate"
        >
          {{ props.item.userName || '---' }}
        </div>
        <div class="text-xs text-grayDefault ml-2 mt-1">
          {{ $reducePrice(props.item.fans) }}粉丝
        </div>
      </div>
      <div
        v-if="!isSelf"
        class="keepButton active:ring-2 ring-redTitle"
        :class="{ active: props.item.follow }"
        @click="switchFollow"
      >
        {{ props.item.follow ? '已关注' : '+关注' }}
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  defineProps,
  getCurrentInstance,
  computed,
} from 'vue';
import a5 from '@/assets/images/a5.png';
import { Toast } from 'vant';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
let router = useRouter();
let store = useStore();
let { proxy } = getCurrentInstance();

const props = defineProps({
  item: Object,
  callback: Function,
});

let switchFollow = proxy.$debounce(() => {
  proxy
    .$http('post', '/v1/friend/operation', {
      type: props.item.follow ? 2 : 1,
      userId: props.item.userId,
    })
    .then((res) => {
      if (!props.item.follow) {
        Toast('关注成功');
      } else {
        Toast('已取消关注');
      }
      props.item.follow = !props.item.follow;
    })
    .thenError((err) => {
      Toast(err.msg);
    });
}, 300);

let switchLive = proxy.$debounce(() => {
  let switchType = props.item.isLive ? 2 : 1;
  proxy
    .$http('post', '/v1/friend/userLike', {
      dcId: props.item.id,
      likeType: 0,
      type: switchType,
    })
    .then((res) => {
      props.item.isLive = !props.item.isLive;
      if (switchType === 1) {
        props.item.live++;
      } else {
        props.item.live--;
      }
    })
    .thenError((err) => {
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
  router.push(
    `/tabbar/user/creator/show?id=${props.item.userId}`,
  );
}
</script>
<style lang="less" scoped>
.CardCreator {
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 13px;
  position: relative;
  .keepButton {
    background: #ffe5e5;
    border-radius: 18px;
    position: absolute;
    right: 15px;
    bottom: 15px;
    width: 85px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
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
