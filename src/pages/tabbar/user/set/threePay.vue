<template>
  <NavBar
    title="第三方支付"
  />
  <div class=" pageCard-sm">
    <Space height="21" />
    <div class="flex items-center text-sm">
      <Icon
        type="icon-zhifubao"
        size="25"
      />
      <div class=" ml-4 flex-auto">
        支付宝账号
      </div>
      <div
        class=" text-blueDefault"
        @click="clickSwitch"
      >
        {{ bind ? '解绑' : '绑定' }}
      </div>
    </div>
    <van-divider class="my-0 mt-2" />
  </div>
  <van-popup
    v-model:show="bindShow"
    :close-on-click-overlay="false"
    class="transparent"
  >
    <div class="px-9 card w-80 text-blackDefault">
      <Space height="37" />
      <div class=" text-base font-semibold text-center">
        设置支付宝
      </div>
      <Space height="37" />
      <div class=" text-sm">
        支付宝账号
      </div>
      <Space height="10" />
      <div class=" inputCard">
        <van-field
          v-model="zfbAccount"
          type="text"
          size="small"
          placeholder="请输入您的支付宝账号"
        />
      </div>
      <Space height="40" />
      <div class="relative ring-1 rounded-3xl ring-redLine">
        <van-image
          class="w-full"
          :height="parseInt($pxToPxRatio(40), 10)"
          fit="fill"
          :src="a2"
        />
        <div class="flex items-center justify-between absolute left-0 top-0 z-1 w-full h-full text-xs2">
          <div
            class="flex-auto flex justify-center text-redLine"
            @click="cancelBind"
          >
            取消
          </div>
          <div
            class="flex-auto flex justify-center text-white"
            @click="bindAlipay"
          >
            确定
          </div>
        </div>
      </div>
      <Space height="30" />
    </div>
  </van-popup>
  <van-popup
    v-model:show="unbindShow"
    :close-on-click-overlay="false"
    class="transparent"
  >
    <div class="px-9 card w-80 text-blackDefault">
      <Space height="37" />
      <div class=" text-base font-semibold text-center">
        解绑确定
      </div>
      <Space height="20" />
      <div class=" text-sm text-center text-grayTip">
        支付宝：{{ store.state.userinfo.alipayAccount }}
      </div>
      <Space height="20" />
      <div class=" text-sm text-center text-grayTip">
        您确定要解除绑定支付宝吗？
      </div>
      <Space height="35" />
      <div class="relative ring-1 rounded-3xl ring-redLine">
        <van-image
          class="w-full"
          :height="parseInt($pxToPxRatio(40), 10)"
          fit="fill"
          :src="a2"
        />
        <div class="flex items-center justify-between absolute left-0 top-0 z-1 w-full h-full text-xs2">
          <div
            class="flex-auto flex justify-center text-redLine"
            @click="() => unbindShow = false"
          >
            取消
          </div>
          <div
            class="flex-auto flex justify-center text-white"
            @click="unbindSubmit"
          >
            确定
          </div>
        </div>
      </div>
      <Space height="30" />
    </div>
  </van-popup>
</template>
<script setup>
import a2 from '@/assets/images/a2.png';
import { Toast } from 'vant';
import { ref, watchEffect, getCurrentInstance, computed } from 'vue';
import { useStore } from 'vuex';

let { proxy } = getCurrentInstance();
let store = useStore();

let bind = ref(false);
let bindShow = ref(false);
let unbindShow = ref(false);
let zfbAccount = ref('');

watchEffect(() => {
  bind.value = !!store.state.userinfo.isAlipay;
});

function clickSwitch() {
  if (bind.value) {
    unbindShow.value = true;
  } else {
    bindShow.value = true;
  }
}
function cancelBind() {
  bindShow.value = false;
  zfbAccount.value = '';
}
function bindAlipay() {
  proxy.$http('post', '/v1/modifyUser/modifyAliPay', {
    aliPay: zfbAccount.value,
  })
    .then(res => {
      Toast.success('绑定成功');
      bindShow.value = false;
      zfbAccount.value = '';
      store.dispatch('getUserinfo');
    }).thenError(err => {
      Toast(err.msg);
    });
}
function unbindSubmit() {
  proxy.$http('post', '/v1/modifyUser/cancelAliPay', {})
    .then(res => {
      Toast.success('解绑成功');
      unbindShow.value = false;
      store.dispatch('getUserinfo');
    }).thenError(err => {
      Toast(err.msg);
    });
}
</script>
<style lang="less" scoped>
</style>
