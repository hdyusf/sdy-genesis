<template>
  <van-popup
    v-model:show="pay"
    position="bottom"
    :round="true"
  >
    <Icon
      v-if="payNext"
      class="absolute left-4 top-7 z-1"
      type="icon-fanhui"
      size="23"
      @click="() => (payNext = false)"
    />
    <Icon
      class="absolute right-10 top-7 z-1"
      type="icon-guanbi"
      size="23"
      @click="() => (pay = false)"
    />
    <Space height="34" />
    <div class="px-6">
      <div
        class="text-redTitle text-2xl font-semibold text-center"
      >
        ¥ {{ $formatPrice(props.detail.price, 2, true) }}
      </div>
      <Space height="30" />
      <!-- <div class="text-xs text-grayDefault text-center">
        支付倒计时：{{ showCountDown }}
      </div> -->
      <template v-if="!payNext">
        <Space height="15" />
        <div class="px-5 text-sm">
          <van-radio-group v-model="payType">
            <div
              v-for="item of payList"
              :key="item"
              class="flex justify-between items-center mb-6"
              @click="() => (payType = item.status)"
            >
              <div class="flex items-center">
                <Icon
                  :type="item.icon"
                  size="20"
                />
                <Space width="10" />
                {{ item.title }}
              </div>
              <van-radio :name="item.status">
                <template #icon="props">
                  <van-image
                    v-show="props.checked"
                    :width="parseInt($pxToPxRatio(14), 10)"
                    :height="parseInt($pxToPxRatio(14), 10)"
                    fit="cover"
                    :src="d1"
                  />
                  <van-image
                    v-show="!props.checked"
                    :width="parseInt($pxToPxRatio(14), 10)"
                    :height="parseInt($pxToPxRatio(14), 10)"
                    fit="cover"
                    :src="d2"
                  />
                </template>
              </van-radio>
            </div>
          </van-radio-group>
        </div>
        <Space height="31" />
      </template>
      <template v-else>
        <Space height="33" />
        <div class="text-sm">
          交易密码
        </div>
        <Space height="10" />
        <div class="border rounded-md px-3">
          <van-field
            v-model="payPassword"
            size="normal"
            placeholder="请输入您的交易密码"
            class="text-sm"
            :type="payPasswordShow ? 'text' : 'password'"
            :right-icon="
              payPasswordShow ? 'eye' : 'closed-eye'
            "
            @click-right-icon="
              () => (payPasswordShow = !payPasswordShow)
            "
          />
        </div>
        <Space height="53" />
      </template>
      <van-button
        type="danger"
        block
        round
        @click="paySubmit"
      >
        {{ payNext || payType ? '确认支付' : '下一步' }}
      </van-button>
      <Space height="30" />
    </div>
  </van-popup>
</template>
<script setup>
import {
  ref,
  watchEffect,
  computed,
  getCurrentInstance,
  watch,
} from 'vue';
import { Toast, Dialog } from 'vant';
import { useCountDown } from '@vant/use';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import d1 from '@/assets/images/d1.png';
import d2 from '@/assets/images/d2.png';
import { originPay } from '@/utils/common';
import { useStore } from 'vuex';
let route = useRoute();
let { proxy, emit } = getCurrentInstance();
let store = useStore();

let props = defineProps({
  detail: {},
  pay: Boolean,
  payCallback: Function,
});
let pay = ref(false);
watch(
  () => props.pay,
  (val) => {
    if (val) {
      pay.value = true;
    }
  },
);
watch(
  () => pay.value,
  (val) => {
    if (!val) {
      emit('update:pay', false);
    }
  },
);
let payList = ref([
  {
    icon: 'icon-renminbi',
    title: '余额',
    status: 0,
  },
  {
    icon: 'icon-zhifubao',
    title: '支付宝',
    status: 1,
  },
]);

if (!window.plus) {
  payList.value = [
    {
      icon: 'icon-renminbi',
      title: '余额',
      status: 0,
    },
  ];
}

let payNext = ref(false);
let payType = ref(0);
let payPassword = ref('');
let payPasswordShow = ref(false);
let payTime = ref(30);
const countDown = useCountDown({
  time: payTime.value * 60 * 1000,
});
let showCountDown = computed(() => {
  return `${countDown.current.value.minutes}:${countDown.current.value.seconds}`;
});

proxy
  .$http('post', '/v1/order/orderOverMinute', {})
  .then((res) => {
    payTime.value = res.data;
    countDown.start();
  })
  .thenError((res) => Toast(res.msg));
async function paySubmit() {
  if (payType.value === 0) {
    let userinfo = await store.dispatch('getUserinfo');
    if (!userinfo.isPayPassWord) {
      Dialog.confirm({
        closeOnClickOverlay: true,
        message: '请先设置交易密码',
        theme: 'round-button',
      })
        .then(() => {
          proxy.$router.push('/tabbar/user/set/payPassword');
        })
        .catch(() => {});
      return;
    }
    if (!payNext.value) {
      payNext.value = true;
      return;
    }
  }
  // 创建订单
  if (
    route.query.type === '待付款' &&
    route.query.origin === 'buy'
  ) {
    payStart(route.query.id);
  } else {
    proxy
      .$http('post', '/v1/order/create', {
        dcId: route.query.id,
        type: payType.value,
        payPassWord: payPassword.value,
      })
      .then((res) => {
        payStart(res.data);
      })
      .thenError((res) => {
        Toast(res.msg);
      })
      .all((res) => {});
  }

}
let orderId = ref('');
let payCallbackVerify = ref(false);
function payStart(res) {
  orderId.value = res;
  // pay submit
  proxy
    .$http('post', '/v1/order/buy', {
      orderId: res,
      payPassWord: payPassword.value,
      type: payType.value,
    })
    .then((res) => {
      if (payType.value === 0) {
        Toast.success('购买成功');
        payNext.value = false;
        pay.value = false;
        props.payCallback();
      }
      if (payType.value === 1) {
        let callback = () => {
          // await pay success callback
          apySuccess();
        };
        let errorCallback = (res) => {
          Toast.fail('支付失败');
        };
        // alipay
        originPay('alipay', res.data, callback, errorCallback);
        awaitPaySuccess();
      }
    })
    .thenError((res) => Toast(res.msg));
}
let awaitPayCallbackTime = ref('');
let awaitPayCallbackNumber = ref(0);
function apySuccess() {
  if (payCallbackVerify.value) return;
  payCallbackVerify.value = true;
  Toast.success('购买成功');
  payNext.value = false;
  pay.value = false;
  props.payCallback();
}
function awaitPaySuccess() {
  awaitPayCallbackTime.value = setInterval(() => {
    proxy.$http('post', `/v1/order/getStatusById?orderId=${orderId.value}`, {})
      .then(res => {
        if (res.data) {
          clearTimeout(awaitPayCallbackTime.value);
          apySuccess();
        }
      }).thenError(res => Toast(res.msg)).all(() => {
        awaitPayCallbackNumber.value++;
      });
  }, 2000);
}
watchEffect(() => {
  if (!pay.value) {
    clearTimeout(awaitPayCallbackTime.value);
    setTimeout(() => {
      payNext.value = false;
    }, 300);
  }
});

onBeforeRouteLeave(() => {
  clearTimeout(awaitPayCallbackTime.value);
});

</script>
<style lang="less" scoped></style>
