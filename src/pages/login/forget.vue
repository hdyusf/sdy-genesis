<template>
  <NavBar title="忘记密码" />
  <Space height="24" />
  <div class=" pageCard">
    <van-field
      v-model="phone"
      type="tel"
      placeholder="请输入手机号"
    />
    <van-divider class="my-0" />
    <Space height="20" />
    <van-field
      v-model="code"
      type="digit"
      placeholder="请输入验证码"
    >
      <template #button>
        <div class="flex items-center">
          <Space
            height="12"
            width="1"
            background-color="#D8D8D8"
          />
          <Space width="12" />
          <SendCode
            url="/v1/modifyUser/forgetPassWordCode"
            :phone="phone"
          />
        </div>
      </template>
    </van-field>
    <van-divider class="my-0" />
    <Space height="20" />
    <van-field
      v-model="password"
      placeholder="请输入登录密码"
      :type="passwordShow ? 'text' : 'password'"
      :right-icon="passwordShow ? 'eye' : 'closed-eye'"
      @click-right-icon="() => passwordShow = !passwordShow"
    />
    <van-divider class="my-0" />
    <Space height="20" />
    <van-field
      v-model="verifyPassword"
      placeholder="重复登录密码"
      :type="verifyPasswordShow ? 'text' : 'password'"
      :right-icon="verifyPasswordShow ? 'eye' : 'closed-eye'"
      @click-right-icon="() => verifyPasswordShow = !verifyPasswordShow"
    />
    <van-divider class="my-0" />
    <Space height="68" />
    <van-button
      type="danger"
      round
      :disabled="!phone || !code || !password || !verifyPassword"
      :loading="loading"
      @click="submit"
    >
      完成
    </van-button>
  </div>
</template>
<script setup>
import { Toast } from 'vant';
import { isMobilePhone } from 'validator';
import { ref, watchEffect, getCurrentInstance, computed } from 'vue';
let {proxy} = getCurrentInstance();

const phone = ref('');
const code = ref('');
const password = ref('');
const passwordShow = ref(false);
const verifyPassword = ref('');
const verifyPasswordShow = ref(false);

let loading = ref(false);
let submit = proxy.$debounce(() => {
  if (!isMobilePhone(phone.value, ['zh-CN'])) {
    Toast('请输入正确的手机号');
    return;
  }
  if (password.value !== verifyPassword.value) {
    Toast('两次密码不一致');
    return;
  }
  loading.value = true;
  proxy.$http('post', '/v1/modifyUser/ModifyPassword', {
    'phone': phone.value,
    'code': code.value,
    'password': password.value,
    'validatePassword': verifyPassword.value
  })
    .then(res => {
      Toast.success('密码修改成功');
      phone.value = '';
      code.value = '';
      password.value = '';
      verifyPassword.value = '';
      passwordShow.value = false;
      verifyPasswordShow.value = false;
    }).thenError(res => {
      Toast(res.msg);
    }).all(res => {
      loading.value = false;
    });
});
</script>
<style lang="less" scoped>
</style>
