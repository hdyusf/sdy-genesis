<template>
  <NavBar title="添加银行卡" />
  <div class="pageCard-sm">
    <Space height="16" />
    <div class="card px-5 py-5">
      <div class="text-sm">
        银行
      </div>
      <Space height="10" />
      <div class="inputCard flex items-center">
        <van-field
          v-model="name"
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
      <div class="text-sm">
        开户行
      </div>
      <Space height="10" />
      <div class="inputCard">
        <van-field
          v-model="bankSite"
          type="text"
          size="small"
          placeholder="请填写开户行"
        />
      </div>
      <Space height="15" />
      <div class="text-sm">
        银行卡号
      </div>
      <Space height="10" />
      <div class="inputCard">
        <van-field
          v-model="bank"
          type="text"
          size="small"
          placeholder="请输入您的银行卡号"
        />
      </div>
      <Space height="15" />
      <div class="text-sm">
        银行卡预留手机号
      </div>
      <Space height="10" />
      <div class="inputCard">
        <van-field
          v-model="phone"
          type="tel"
          size="small"
          placeholder="请输入您的银行卡预留手机号"
        />
      </div>
    </div>
    <div class="fixedBottomButton">
      <van-button
        type="danger"
        block
        round
        :disabled="!bankSite || !bank || !phone"
        :loading="loading"
        @click="submit"
      >
        完成
      </van-button>
    </div>
  </div>
  <van-popup
    v-model:show="selectBankPopup"
    round
    position="bottom"
  >
    <van-picker
      :columns="bankList.map((item) => item.title)"
      :default-index="bankIndex"
      @cancel="selectBankPopup = false"
      @confirm="onConfirm"
    />
  </van-popup>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue';
import { isMobilePhone } from 'validator';
import { Toast } from 'vant';
import bank1 from './images/bank1.png';
import bank2 from './images/bank2.png';
import bank3 from './images/bank3.png';
import bank4 from './images/bank4.png';
import bank5 from './images/bank5.png';
import bank6 from './images/bank6.png';
import bank7 from './images/bank7.png';
import bank8 from './images/bank8.png';
import bank9 from './images/bank9.png';
let { proxy } = getCurrentInstance();

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

let name = ref(bankList[0].title);
let bankIndex = ref(0);
let bankSite = ref('');
let bank = ref('');
let phone = ref('');
let selectBankPopup = ref(false);
let loading = ref(false);

const onConfirm = (value, index) => {
  name.value = value;
  bankIndex.value = index;
  selectBankPopup.value = false;
};

let submit = proxy.$debounce(() => {
  if (!/^[1-9]\d{9,29}$/.test(bank.value)) {
    Toast('请输入正确的银行卡');
    return;
  }
  if (!isMobilePhone(phone.value, ['zh-CN'])) {
    Toast('请输入正确的手机号');
    return;
  }

  loading.value = true;
  proxy
    .$http('post', '/v1/assets/bindCarc', {
      bankOpening: bankSite.value,
      cardId: bankIndex.value + 1,
      cardNo: bank.value,
      phone: phone.value,
    })
    .then((res) => {
      Toast.success('添加成功');
      bank.value = '';
      phone.value = '';
      bankSite.value = '';
      bankIndex.value = '';
      proxy.$router.back();
    })
    .thenError((err) => {
      Toast(err.msg);
    })
    .catch((res) => {
      Toast.fail(JSON.stringify(res));
    })
    .all((res) => {
      loading.value = false;
    });
});
</script>
<style lang="less" scoped></style>
