<template>
  <div class="card overflow-hidden relative mb-4">
    <div
      class="absolute top-0 right-0 w-17 text-xs leading-4 text-right pr-3 py-1"
      :style="{
        'background': `linear-gradient(-90deg, ${statusColor}, white)`,
        color: textColor,
      }"
    >
      <span>{{ props.item.status }}</span>
    </div>
    <Space height="15" />
    <div class="pl-6 text-xs text-grayTip">
      {{ showTimeTitle }}：{{ showTime }}
    </div>
    <Space height="10" />
    <van-divider class="my-0 px-4" />
    <Space height="20" />
    <div class="flex pl-6 pr-6">
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
          <div class=" text-xs2 text-redTitle font-semibold max-w-bai2 truncate">
            ¥ {{ $formatPrice(props.item.price) }}
          </div>
        </div>
        <Space height="7" />
        <div class="flex props.items-center text-grayDefault justify-between text-xs2">
          <div
            class=" max-w-bai2 truncate"
            @click="goCreatorDetail"
          >
            {{ props.item.user || '---' }}
          </div>
          <div>x {{ props.item.number }}</div>
        </div>
        <Space height="7" />
        <div
          v-if="publish"
          class="flex props.items-center text-xs2 text-grayDefault"
        >
          <span class=" flex-shrink-0">藏品ID：</span>
          <span
            class=" w-32 truncate"
            :class="!props.noDetail ? 'border-b-1' : ''"
            @click="clickDetail"
          >{{ props.item.id }}</span>
        </div>
        <div
          v-else
          class="flex props.items-center text-xs2 text-grayDefault"
          @click="() => props.noDetail ? copy() : ''"
        >
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
      <Space height="15" />
      <div class=" text-xs text-orangeTip">
        订单将在 {{ showCountDown }} 分之后自动取消，请尽快付款
      </div>
      <Space height="15" />
      <div class="flex justify-end props.items-center gap-4">
        <div
          class=" flex justify-center props.items-center ring-1 ring-gray-200 py-1.5 px-7 rounded-full text-xs2"
          @click="clickCancelPay"
        >
          取消
        </div>
        <div
          class=" ml-4 flex justify-center props.items-center ring-1 ring-redTitle py-1.5 px-7 rounded-full text-xs2 text-redTitle"
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
import { Toast } from 'vant';
import { computed, defineProps, getCurrentInstance, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { copyText } from 'vue3-clipboard';
import { useCountDown } from '@vant/use';
import dayjs from 'dayjs';
import { useStore } from 'vuex';
let store = useStore();
let route = useRoute();
let router = useRouter();
let {proxy} = getCurrentInstance();

function copy() {
  copyText(props.item.orderId, undefined, (error, event) => {
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
  listView: {
    type: Object,
    default: null,
  },
});

let textColor = ref('#9B9B9B');
let statusColor = ref('#E1E1E1');
let showTime = ref(props.item.time);
let showTimeTitle = ref('创建时间');
watchEffect(() => {
  if (props.item.status) {
    updateStatusShow();
  }
});
function updateStatusShow() {
  statusColor.value = '#E1E1E1';
  switch(props.item.status) {
    case '已取消':
    case '买家取消':
    case '卖家取消':
      statusColor.value = '#E1E1E1';
      showTime.value = props.item.cancelTime;
      showTimeTitle.value = '取消时间';
      textColor.value = '#9B9B9B';
      break;
    case '被拒绝':
      statusColor.value = '#FFD5D5';
      textColor.value = '#D42E2E';
      break;
    case '审核中':
    case '被锁定':
    case '待支付':
    case '待付款':
      statusColor.value = '#FFE1C7';
      textColor.value = '#FF7400';
      break;
    case '发布中':
      statusColor.value = '#E2EAFF';
      textColor.value = '#5F8AFF';
      break;
    case '已完成':
      statusColor.value = '#D0EDBD';
      textColor.value = '#5DBD1D';
      showTime.value = props.item.payTime;
      showTimeTitle.value = '完成时间';
      break;
  }
}

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
      updateStatusShow();
      props.listView?.reset();
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
      updateStatusShow();
      props.listView?.reset();
    }).thenError(res => {
      Toast(res.msg);
    });
});

let publish = ref(false);
if (route.path === '/tabbar/user/publish') {
  publish.value = true;
}

let newTime = new Date().getTime();
let time = dayjs(props.item.time).valueOf();
let diff = newTime - time;
let totalTime = store.state.payTime * 60 * 1000 - diff;
const countDown = useCountDown({
  time: totalTime > 0 ? totalTime : 0,
});
let showCountDown = computed(() => {
  return `${countDown.current.value.minutes}:${countDown.current.value.seconds}`;
});
countDown.start();
</script>
<style lang="less" scoped>
</style>
