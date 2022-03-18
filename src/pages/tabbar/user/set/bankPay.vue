<template>
  <NavBar
    title="银行卡设置"
  />
  <div class=" pageCard">
    <template v-if="!list.length">
      <Space height="10" />
      <Empty
        type="bank"
        title="暂无卡片"
      />
      <div
        class="fixedBottomButton"
        @click="() => $router.push('/tabbar/user/set/addBankPay')"
      >
        <van-button
          type="danger"
          block
          round
        >
          添加银行卡
        </van-button>
      </div>
    </template>
    <template v-else>
      <div
        class=" sticky bg-grayBg z-2"
        :style="{top: $pxToPxRatio(46) + 'px'}"
      >
        <Space height="15" />
        <div class="flex items-center justify-between">
          <div class=" text-sm font-semibold">
            我的卡<span class=" text-grayDefault">（共{{ list.length }}张）</span>
          </div>
          <div
            class=" rounded-full bg-[#FFDBDB] text-xs px-2 py-1"
            @click="() => $router.push('/tabbar/user/set/addBankPay')"
          >
            <van-icon
              name="plus"
              class=" text-redTitle font-semibold"
            />
            添加银行卡
          </div>
        </div>
        <Space height="13" />
      </div>
      <div
        v-for="(item, index) of list"
        :key="index"
        class="relative mb-4"
      >
        <van-image
          class="w-full rounded-lg overflow-hidden"
          :height="parseInt($pxToPxRatio(121), 10)"
          fit="cover"
          :src="item.icon"
        />
        <div class="absolute top-5 left-16 text-white">
          <div class=" text-base font-semibold">
            {{ item.title }}储蓄卡
          </div>
          <Space height="15" />
          <div class=" text-sm font-light">
            ****{{ item.number.slice(-4) }}
          </div>
        </div>
        <div
          class="absolute right-4 top-12 text-xs2 text-white bg-black/25 px-4 py-1 rounded-full"
          @click="() => unbindShow(index)"
        >
          解绑
        </div>
      </div>
    </template>
  </div>
  <van-popup
    v-model:show="unbindPopup"
    round
    class="transparent"
  >
    <div class="card w-80 text-blackDefault px-9 flex flex-col items-center">
      <Space height="45" />
      <van-image
        :width="parseInt($pxToPxRatio(128), 10)"
        :height="parseInt($pxToPxRatio(76), 10)"
        fit="cover"
        :src="unbank"
      />
      <Space height="30" />
      <div class=" text-base font-semibold">
        解绑确定
      </div>
      <Space height="15" />
      <div class=" text-sm text-grayTip">
        银行：{{ list[unbindIndex]?.title }}
      </div>
      <Space height="15" />
      <div class=" text-sm text-grayTip">
        银行卡号：****{{ list[unbindIndex]?.number.slice(-4) }}
      </div>
      <Space height="15" />
      <div class=" text-sm text-grayTip">
        您确定要解除绑定此银行卡吗？
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
            @click="() => unbindPopup = false"
          >
            取消
          </div>
          <div
            class="flex-auto flex justify-center text-white"
            @click="unbind"
          >
            确定
          </div>
        </div>
      </div>
      <Space height="24" />
    </div>
  </van-popup>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue';
import a2 from '@/assets/images/a2.png';
import bank1 from './images/bank1.png';
import bank2 from './images/bank2.png';
import bank3 from './images/bank3.png';
import bank4 from './images/bank4.png';
import bank5 from './images/bank5.png';
import bank6 from './images/bank6.png';
import bank7 from './images/bank7.png';
import bank8 from './images/bank8.png';
import bank9 from './images/bank9.png';
import unbank from './images/unbank.png';
import { Toast } from 'vant';
let {proxy} = getCurrentInstance();

const bankList = [
  {
    title: '中国银行',
    image: bank1,
  },
  {
    title: '中国建设银行',
    image: bank2,
  },
  {
    title: '中国工商银行',
    image: bank3,
  },
  {
    title: '中国农业银行',
    image: bank4,
  },
  {
    title: '中国邮政储蓄银行',
    image: bank5,
  },
  {
    title: '交通银行',
    image: bank6,
  },
  {
    title: '招商银行',
    image: bank7,
  },
  {
    title: '平安银行',
    image: bank8,
  },
  {
    title: '广发银行',
    image: bank9,
  },
];

let list = ref([]);

let unbindPopup = ref(false);
let unbindIndex = ref(0);
function unbindShow(index) {
  unbindPopup.value = true;
  unbindIndex.value = index;
}

function unbind() {
  proxy.$http('post', `/v1/assets/unbindCarc?cardId=${list.value[unbindIndex.value].id}`, {})
    .then(res => {
      Toast.success('解绑成功');
      unbindPopup.value = false;
      getList();
    }).thenError(err => {
      Toast(err.msg);
    });
}

getList();
function getList() {
  proxy.$http('post', '/v1/assets/myCarc?page=1&size=50', {})
    .then(res => {
      list.value = res.data.list.map(item => {
        let bank = bankList.find(bank => bank.title === item.cardName);
        return {
          id: item.id,
          icon: bank.image,
          title: item.cardName,
          number: item.cardNo,
        };
      });
    }).thenError(err => {
      console.log(err.msg);
    });
}

</script>
<style lang="less" scoped>
</style>
