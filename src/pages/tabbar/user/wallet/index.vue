<template>
  <NavBar
    title="钱包"
    :transparent="navBarTransparent"
  >
    <template #right>
      <div
        class=" text-xs2"
        @click="() => $router.push('/tabbar/user/wallet/extractRecord')"
      >
        提现详情
      </div>
    </template>
  </NavBar>
  <van-image
    class="w-full absolute top-0 left-0"
    :height="parseInt($pxToPxRatio(290), 10)"
    fit="cover"
    :src="a1"
  />
  <div class="pageCard-sm">
    <Space height="15" />
    <div class="bg-white/60 rounded-lg2 overflow-hidden">
      <div class=" text-sm p-4.5 bg2">
        <span class="text-grayDefault">总金额(元)</span>
        <span class="ml-2.5 text-grayTip">¥{{ $formatPrice(info.balance, 2, true) }}</span>
      </div>
      <div class="px-5">
        <Space height="15" />
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center">
              <div class="text-xs2 text-grayDefault">
                可用余额(元)
              </div>
              <Icon
                class="ml-2.5"
                :type="
                  showMoney
                    ? 'icon-yincang'
                    : 'icon-chakan1'
                "
                size="16"
                @click="() => (showMoney = !showMoney)"
              />
            </div>
            <div
              class="mt-3 text-xl2 font-medium text-redTitle"
            >
              ¥{{
                showMoney
                  ? $formatPrice(info.available, 2, true)
                  : info.available
                    .toString()
                    .replace(/\d/g, '*')
              }}
            </div>
          </div>
          <div
            class="text-redTitle text-sm px-4 py-1 bg-pinkButton rounded-full"
            @click="clickOutMoney"
          >
            申请提现
          </div>
        </div>
        <Space height="20" />
        <van-divider class="my-0" />
        <Space height="15" />
        <div class="flex items-center text-xs2">
          <div class="flex-auto flex flex-col items-center">
            <div class="text-grayDefault">
              冻结金额(元)
            </div>
            <div class="mt-1.5 text-grayTip">
              ¥{{ $formatPrice(info.frozen, 2, true) }}
            </div>
          </div>
          <div class="flex-auto flex flex-col items-center">
            <div class="text-grayDefault">
              累计提现(元)
            </div>
            <div class="mt-1.5 text-grayTip">
              ¥{{
                $formatPrice(info.totalWithdraw, 2, true)
              }}
            </div>
          </div>
        </div>
        <Space height="15" />
      </div>
    </div>
    <Space height="20" />
    <div class="text-base font-semibold">
      资金流水
    </div>
    <Space height="15" />
    <van-divider class="my-0 w-screen -ml-4" />
    <div
      class=" sticky bg-grayBg z-2"
      :style="{top: $pxToPxRatio(46) + 'px'}"
    >
      <Space height="9" />
      <div class="listSelectType">
        <div
          v-for="(item, index) in listArr"
          :key="index"
          class="flex-auto"
          :class="{
            'text-redTitle': listSelect === item.status,
          }"
          @click="() => (listSelect = item.status)"
        >
          {{ item.title }}
        </div>
      </div>
      <Space height="17" />
      <van-divider class="my-0 w-screen -ml-4" />
    </div>
    <ListView
      ref="listView"
      :get-list="getList"
      empty="暂无数据"
      pull-refresh
    >
      <template #default="{ data }">
        <template
          v-for="(item) of data"
          :key="item"
        >
          <div
            class="flex py-2.5 px-4 items-center justify-between"
          >
            <div>
              <div class="text-sm">
                {{ item.name }}
              </div>
              <div class="mt-1.5 text-sm text-grayTip">
                {{ item.time }}
              </div>
            </div>
            <div class="text-base font-semibold">
              {{ item.type }}{{ item.price }}
            </div>
          </div>
          <van-divider class="my-0" />
        </template>
      </template>
    </ListView>
  </div>
  <van-popup
    v-model:show="withdraw"
    class="transparent"
  >
    <div
      class="bg-white rounded-lg2 px-9 w-80 text-blackDefault text-sm"
    >
      <Space height="35" />
      <div class="font-semibold text-base text-center">
        提现
      </div>
      <Space height="35" />
      <div>银行卡</div>
      <Space height="10" />
      <div class="inputCard flex items-center">
        <van-field
          v-model="bank"
          type="text"
          size="small"
          readonly
          placeholder="请选择银行"
          @click="() => (selectBankPopup = true)"
        />
        <van-icon
          name="arrow-down"
          class="text-grayDefault"
        />
      </div>
      <Space height="15" />
      <div>提现金额</div>
      <Space height="10" />
      <div class="flex items-center inputCard">
        <div class="mr-2">
          ¥
        </div>
        <van-field
          v-model="money"
          type="text"
          size="small"
          :placeholder="`最小提现金额${minMoney}元`"
        />
      </div>
      <Space height="10" />
      <div class="text-xs text-blueDefault">
        可提现金额：{{ $formatPrice(info.available, 2, true) }}元
      </div>
      <Space height="15" />
      <div>交易密码</div>
      <Space height="10" />
      <div class="flex items-center inputCard">
        <van-field
          v-model="payPassword"
          size="small"
          placeholder="请输入交易密码"
          :type="payPasswordShow ? 'text' : 'password'"
          :right-icon="payPasswordShow ? 'eye' : 'closed-eye'"
          @click-right-icon="() => payPasswordShow = !payPasswordShow"
        />
      </div>
      <Space height="20" />
      <div class="relative ring-1 rounded-3xl ring-redLine">
        <van-image
          class="w-full"
          :height="parseInt($pxToPxRatio(40), 10)"
          fit="fill"
          :src="a2"
        />
        <div
          class="flex items-center justify-between absolute left-0 top-0 z-1 w-full h-full text-xs2"
        >
          <div
            class="flex-auto flex justify-center text-redLine"
            @click="() => (withdraw = false)"
          >
            取消
          </div>
          <div
            class="flex-auto flex justify-center text-white"
            :loading="loading"
            @click="submit"
          >
            确定
          </div>
        </div>
      </div>
      <Space height="10" />
      <div class="text-xs text-center text-blueDefault">
        提现手续费：{{ fee }}% 预计到账：¥{{
          $formatPrice(
            (money / 100) * (100 - fee) || 0,
            2,
            true,
          )
        }}
      </div>
      <Space height="43" />
    </div>
  </van-popup>
  <van-popup
    v-model:show="selectBankPopup"
    round
    position="bottom"
  >
    <van-picker
      :columns="bankList.map((item) => item?.cardName)"
      :default-index="bankIndex"
      @cancel="selectBankPopup = false"
      @confirm="onConfirm"
    />
  </van-popup>
</template>
<script setup>
import a2 from '@/assets/images/a2.png';
import { Toast } from 'vant';
import {
  getCurrentInstance, ref, watch, watchEffect
} from 'vue';
import a1 from './images/a1.png';
let { proxy } = getCurrentInstance();

let listSelect = ref(null);
let listArr = ref([
  {
    title: '全部',
    status: null,
  },
  {
    title: '收入',
    status: 1,
  },
  {
    title: '支出',
    status: 0,
  },
]);

let showMoney = ref(true);
let info = ref({});
function getWalletInfo() {
  proxy
    .$http('post', '/v1/assets/info', {})
    .then((res) => {
      info.value = res.data;
    })
    .thenError((res) => Toast(res.msg));
}
getWalletInfo();

let typeList = ref([]);
function getTypeList() {
  proxy
    .$http('post', '/v1/assets/assetsBillType', {})
    .then((res) => {
      typeList.value = res.data.map((item) => {
        return {
          title: item.typeName,
          status: item.type,
        };
      });
    })
    .thenError((res) => Toast(res.msg));
}
getTypeList();

async function getList(page) {
  let res = await proxy.$http(
    'post',
    '/v1/assets/assetsBillRecord',
    {
      direction: listSelect.value,
      page: page,
      size: 10,
      type: null,
    },
  );
  res.data.list = res.data.list.map((item) => {
    return {
      id: 1,
      name: item.typeName,
      time: item.createTime,
      price: proxy.$formatPrice(Math.abs(item.amount), 2, true),
      type: item.direction === 0 ? '-' : '+',
    };
  });

  return res;
}
let listView = ref();
watch(
  () => listSelect.value,
  () => {
    listView.value?.reset();
  },
);

let withdraw = ref(false);
let bank = ref('');
let bankIndex = ref(0);
let money = ref('');
let minMoney = ref(0);
let payPassword = ref('');
let payPasswordShow = ref(false);
let selectBankPopup = ref(false);
let fee = ref(0);

function resetPage() {
  bank.value = '';
  bankIndex.value = 0;
  money.value = '';
  payPassword.value = '';
}
watchEffect((val) => {
  if (!withdraw.value) {
    resetPage();
  }
});

const onConfirm = (value, index) => {
  bank.value = value;
  bankIndex.value = index;
  selectBankPopup.value = false;
};

let bankList = ref([]);
proxy
  .$http('post', '/v1/assets/myCarc?page=1&size=50', {})
  .then((res) => {
    if (!res.data.list.length) return;
    bankList.value = res.data.list;
    bank.value = res.data.list[0].cardName;
  })
  .thenError((res) => Toast(res.msg));

proxy
  .$http('post', '/v1/assets/withdrawFee', {})
  .then((res) => {
    minMoney.value = res.data.minAmount;
    fee.value = res.data.fee;
  })
  .thenError((res) => Toast(res.msg));

let loading = ref(false);
let submit = proxy.$debounce(() => {
  if (!money.value) {
    Toast('请输入提现金额');
    return;
  }
  if (money.value < minMoney.value) {
    Toast(`最低提现金额为${minMoney.value}元`);
    return;
  }
  if (!payPassword.value) {
    Toast('请输入支付密码');
    return;
  }
  loading.value = true;
  proxy.$http('post', '/v1/assets/withdraw', {
    'amount': money.value,
    'cardId': bankList.value[bankIndex.value].id,
    'payPassword': payPassword.value
  })
    .then(res => {
      Toast('提交成功');
      money.value = '';
      payPassword.value = '';
      withdraw.value = false;
      getWalletInfo();
    }).thenError(res => {
      Toast(res.msg);
    }).all(res => {
      loading.value = false;
    });
});

let navBarTransparent = ref(true);
window.onscroll = () => {
  if (window.scrollY > 120) {
    navBarTransparent.value = false;
  } else {
    navBarTransparent.value = true;
  }
};

function clickOutMoney() {
  if (!bankList.value.length) {
    Toast('请先绑定银行卡');
    return;
  } else {
    withdraw.value = true;
  }
}
</script>
<style lang="less" scoped>
.bg2 {
  background: linear-gradient(
    287deg,
    rgba(255, 255, 255, 0) 0%,
    #ffeded 100%,
    #ffeded 100%
  );
}
</style>
