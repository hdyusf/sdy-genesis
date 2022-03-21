<template>
  <NavBar :title="update ? '修改交易密码' : '交易密码'" />
  <div class="pageCard">
    <!-- <template v-if="!update">
      <Space height="10" />
      <van-field
        v-model="password"
        class="text-sm"
        placeholder="请输入交易密码"
        :type="passwordShow ? 'text' : 'password'"
        :right-icon="passwordShow ? 'eye' : 'closed-eye'"
        @click-right-icon="() => passwordShow = !passwordShow"
      />
      <van-divider class="my-0" />
      <Space height="22" />
      <van-field
        v-model="verifyPassword"
        class="text-sm"
        placeholder="请确认交易密码"
        :type="verifyPasswordShow ? 'text' : 'password'"
        :right-icon="verifyPasswordShow ? 'eye' : 'closed-eye'"
        @click-right-icon="() => verifyPasswordShow = !verifyPasswordShow"
      />
      <van-divider class="my-0" />
      <div
        class="fixedBottomButton"
      >
        <van-button
          type="danger"
          block
          round
          :disabled="!password || !verifyPassword"
          @click="submit"
        >
          完成
        </van-button>
      </div>
    </template>-->
    <!-- <template v-else> -->
    <Space height="15" />
    <div class="text-base">
      {{ store.state.userinfo?.phone }}
    </div>
    <div class="text-xs2 text-grayDefault mt-1">
      {{ update ? '修改' : '设置' }}交易密码需先验证当前手机号
    </div>
    <Space height="22" />
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
            url="/v1/modifyUser/modifyPayPasswordCode"
            :phone="store.state.userinfo?.phone"
          />
        </div>
      </template>
    </van-field>
    <van-divider class="my-0" />
    <Space height="22" />
    <van-field
      v-model="password"
      class="text-sm"
      placeholder="请输入新的交易密码"
      :type="passwordShow ? 'text' : 'password'"
      :right-icon="passwordShow ? 'eye' : 'closed-eye'"
      @click-right-icon="() => passwordShow = !passwordShow"
    />
    <van-divider class="my-0" />
    <Space height="22" />
    <van-field
      v-model="verifyPassword"
      class="text-sm"
      placeholder="请确认交易密码"
      :type="verifyPasswordShow ? 'text' : 'password'"
      :right-icon="verifyPasswordShow ? 'eye' : 'closed-eye'"
      @click-right-icon="() => verifyPasswordShow = !verifyPasswordShow"
    />
    <van-divider class="my-0" />
    <Space height="22" />
    <div class=" text-xs text-grayDefault text-right">
      交易密码必须为6位字符或数字组成
    </div>
    <div class="fixedBottomButton">
      <van-button
        type="danger"
        block
        round
        :disabled="!code || !password || !verifyPassword"
        :loading="loading"
        @click="submitUpdate"
      >
        确定修改
      </van-button>
    </div>
    <!-- </template> -->
  </div>
</template>
<script setup>
import { Toast } from 'vant';
import { ref, watchEffect, getCurrentInstance, computed } from 'vue';
import { useStore } from 'vuex';

let { proxy } = getCurrentInstance();
let store = useStore();

let code = ref('');
let password = ref('');
const passwordShow = ref(false);
let verifyPassword = ref('');
const verifyPasswordShow = ref(false);

let update = ref(false);
watchEffect(() => {
  update.value = store.state.userinfo.isPayPassWord;
});

let loading = ref(false);
let submitUpdate = proxy.$debounce(() => {
  if (password.value.length !== 6 || !(/[A-Za-z0-9]{6}/.test(password.value))) {
    Toast('交易密码必须为6位字符或数字组成');
    return;
  }
  if (password.value !== verifyPassword.value) {
    Toast('两次密码不一致');
    return;
  }
  loading.value = true;
  proxy.$http('post', '/v1/modifyUser/ModifyPayPassword', {
    'code': code.value,
    'password': password.value,
    'validatePassword': verifyPassword.value
  })
    .then(res => {
      Toast.success(`${update.value ? '修改' : '设置'}成功`);
      code.value = '';
      password.value = '';
      verifyPassword.value = '';
      passwordShow.value = false;
      verifyPasswordShow.value = false;
      store.dispatch('getUserinfo');
      proxy.$router.back();
    }).thenError(res => {
      Toast(res.msg);
    }).all(res => {
      loading.value = false;
    });
});
</script>
<style lang="less" scoped>
</style>
