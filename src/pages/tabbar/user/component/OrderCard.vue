<template>
  <div class="card overflow-hidden relative mb-4">
    <div
      class="absolute top-0 right-0 w-17 text-sm leading-4 text-white text-right pr-1"
      :style="{
        'background': `linear-gradient(-90deg, ${statusColor}, white)`,
      }"
    >
      <span class=" transform scale-75 block">{{ props.item.status }}</span>
    </div>
    <Space height="20" />
    <div class="flex pl-3.5 pr-6">
      <van-image
        class=" rounded-md overflow-hidden"
        :width="parseInt($pxToPxRatio(80), 10)"
        :height="parseInt($pxToPxRatio(80), 10)"
        fit="cover"
        :src="props.item.img"
        @click="clickDetail"
      />
      <div class="flex-auto ml-4">
        <Space height="3" />
        <div class="flex props.items-center justify-between">
          <div
            class=" text-sm font-semibold w-32 truncate"
            @click="clickDetail"
          >
            {{ props.item.title }}
          </div>
          <div class=" text-xs2 text-redTitle font-semibold">
            ¥ {{ $formatPrice(props.item.price) }}
          </div>
        </div>
        <Space height="7" />
        <div class="flex props.items-center text-grayDefault justify-between text-xs2">
          <div
            class="w-32 truncate"
            @click="goCreatorDetail"
          >
            {{ props.item.user }}
          </div>
          <div>x {{ props.item.number }}</div>
        </div>
        <Space height="7" />
        <div class="flex props.items-center text-xs2 text-grayDefault">
          <span class=" flex-shrink-0">订单号：</span>
          <span
            class=" w-32 truncate"
            :class="!props.noDetail ? 'border-b-1' : ''"
            @click="clickDetail"
          >{{ props.item.orderId }}</span>
          <Icon
            class=" ml-1"
            type="icon-fuzhi-copy"
            size="15"
            @click="() => copy()"
          />
        </div>
      </div>
    </div>
    <Space height="20" />
    <div
      v-if="props.item.status === '待付款'"
      class=" px-3"
    >
      <van-divider class="my-0" />
      <template v-if="props.item.tip">
        <Space height="15" />
        <div class=" text-xs text-orangeTip">
          {{ props.item.tip }}
        </div>
      </template>
      <Space height="15" />
      <div class="flex justify-end props.items-center gap-4">
        <div
          class=" flex justify-center props.items-center ring-1 ring-gray-200 py-1.5 px-7 rounded-full text-xs2"
          @click="clickCancelPay"
        >
          取消
        </div>
        <div
          class=" flex justify-center props.items-center ring-1 ring-redTitle py-1.5 px-7 rounded-full text-xs2 text-redTitle"
          @click="clickDetail"
        >
          付款
        </div>
      </div>
      <Space height="15" />
    </div>
    <div
      v-if="props.item.status === '审核中'"
      class=" px-3"
    >
      <van-divider class="my-0" />
      <Space height="15" />
      <div class="flex justify-end props.items-center gap-4">
        <div
          class=" flex justify-center props.items-center ring-1 ring-gray-200 py-1.5 px-7 rounded-full text-xs2"
          @click="cancel"
        >
          取消
        </div>
      </div>
      <Space height="15" />
    </div>
  </div>
</template>
<script setup>
import a3 from '@/assets/images/a3.png';
import { ref, watchEffect, computed, defineProps, getCurrentInstance } from 'vue';
import { copyText } from 'vue3-clipboard';
import { Toast } from 'vant';
import { useRouter, useRoute } from 'vue-router';
let route = useRoute();
let router = useRouter();
let {proxy} = getCurrentInstance();

function copy() {
  copyText('Hello Clipborad', undefined, (error, event) => {
    if (error) {
      console.error('复制失败');
    } else {
      Toast('复制成功');
    }
  });
}

let props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  noDetail: {
    type: Boolean,
    default: false,
  },
});

let statusColor = computed(() => {
  let color = '#B8B8B8';
  switch(props.item.status) {
    case '被拒绝':
      color = '#CC0909';
      break;
    case '审核中':
    case '被锁定':
    case '待支付':
    case '待付款':
      color = '#FF7400';
      break;
    case '发布中':
      color = '#4375FF';
      break;
  }
  return color;
});

function clickDetail() {
  if (props.noDetail) return;
  let last = route.path.split('/').pop();
  router.push(`/tabbar/user/order?type=${props.item.status}&id=${props.item.orderId}&origin=${last}`);
}

function goCreatorDetail() {
  router.push(`/tabbar/user/creator/show?id=${props.item.userId}`);
}

let cancel = proxy.$debounce(() => {
  proxy.$http('post', `/v1/dc/abrogate?dcId=${props.item.id}`, {})
    .then(res => {
      Toast('取消成功');
      props.item.status = '已取消';
    }).thenError(res => {
      Toast(res.msg);
    });
});

let clickCancelPay = proxy.$debounce(() => {
  proxy.$http('post', '/v1/order/createl', {
    orderId: props.item.id
  })
    .then(res => {
      Toast('取消成功');
      props.item.status = '已取消';
    }).thenError(res => {
      Toast(res.msg);
    });
});
</script>
<style lang="less" scoped>
</style>
