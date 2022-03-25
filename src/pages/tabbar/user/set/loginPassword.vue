<template>
  <NavBar
    :title="update ? '修改登录密码' : '登录密码'"
    :go-back="!($route.query.type === 'login')"
  >
    <template #right>
      <div
        v-if="$route.query.type === 'login'"
        class=" text-sm text-grayDefault"
        @click="() => $router.push('/')"
      >
        跳过
      </div>
    </template>
  </NavBar>
  <div class=" pageCard">
    <template v-if="!update">
      <Space height="10" />
      <van-field
        v-model="password"
        class="text-sm"
        type="password"
        placeholder="请输入登录密码"
      />
      <van-divider class="my-0" />
      <Space height="22" />
      <van-field
        v-model="verifyPassword"
        class="text-sm"
        type="password"
        placeholder="请确认登录密码"
      />
      <van-divider class="my-0" />
      <div
        class="fixedBottomButton"
      >
        <van-button
          type="danger"
          block
          round
          :disabled="submitDisabled"
          :loading="loading"
          @click="submit"
        >
          完成
        </van-button>
      </div>
    </template>
    <template v-else>
      <Space height="15" />
      <div class=" text-base">
        {{ store.state.userinfo?.phone }}
      </div>
      <div class=" text-xs2 text-grayDefault mt-1">
        {{ update ? '修改' : '设置' }}登录密码需先验证当前手机号
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
              url="/v1/modifyUser/modifyLoginPasswordCode"
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
        placeholder="请输入新的登录密码"
        :type="passwordShow ? 'text' : 'password'"
        :right-icon="passwordShow ? 'eye' : 'closed-eye'"
        @click-right-icon="() => passwordShow = !passwordShow"
      />
      <van-divider class="my-0" />
      <Space height="22" />
      <van-field
        v-model="verifyPassword"
        class="text-sm"
        placeholder="请确认登录密码"
        :type="verifyPasswordShow ? 'text' : 'password'"
        :right-icon="verifyPasswordShow ? 'eye' : 'closed-eye'"
        @click-right-icon="() => verifyPasswordShow = !verifyPasswordShow"
      />
      <van-divider class="my-0" />
      <Space height="22" />
      <div
        class="fixedBottomButton"
      >
        <van-button
          type="danger"
          block
          round
          :disabled="submitDisabled"
          :loading="updateLoading"
          @click="updateSubmit"
        >
          确定修改
        </van-button>
      </div>
    </template>
  </div>
</template>
<script setup>
import { Toast } from 'vant';
import { ref, watchEffect, getCurrentInstance, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

let {proxy} = getCurrentInstance();
let store = useStore();
let route = useRoute();

let code = ref('');
let password = ref('');
const passwordShow = ref(false);
let verifyPassword = ref('');
const verifyPasswordShow = ref(false);

let update = ref(false);
watchEffect(() => {
  update.value = store.state.userinfo.isPayPassWord;
});

let submitDisabled = computed(() => {
  if (update.value) {
    return !(password.value && verifyPassword.value && code.value);
  } else {
    return !(password.value && verifyPassword.value);
  }
});
let loading = ref(false);
let submit = proxy.$debounce(() => {
  if (!password.value) {
    Toast('请输入登录密码');
    return;
  }
  if (!verifyPassword.value) {
    Toast('请确认登录密码');
    return;
  }
  if (password.value !== verifyPassword.value) {
    Toast('两次输入的密码不一致');
    return;
  }
  loading.value = true;
  proxy.$http('post', '/v1/modifyUser/setPassword', {
    password: password.value,
    validatePassword: verifyPassword.value,
  })
    .then(res => {
      Toast.success('设置成功');
      if (route.query.type === 'login') {
        proxy.$router.push('/');
      } else {
        password.value = '';
        verifyPassword.value = '';
        passwordShow.value = false;
        verifyPasswordShow.value = false;
        store.dispatch('getUserinfo');
      }
    }).thenError(res => {
      Toast(res.msg);
    }).all(res => {
      loading.value = false;
    });
});

let updateLoading = ref(false);
let updateSubmit = proxy.$debounce(() => {
  if (!code.value) {
    Toast('请输入验证码');
    return;
  }
  if (!password.value) {
    Toast('请输入登录密码');
    return;
  }
  if (!verifyPassword.value) {
    Toast('请确认登录密码');
    return;
  }
  if (password.value !== verifyPassword.value) {
    Toast('两次输入的密码不一致');
    return;
  }
  updateLoading.value = true;
  proxy.$http('post', '/v1/modifyUser/ModifyLoginPassword', {
    code: code.value,
    password: password.value,
    validatePassword: verifyPassword.value,
  })
    .then(res => {
      Toast.success('修改成功');
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
      updateLoading.value = false;
    });
});
</script>
<style lang="less" scoped>
</style>
