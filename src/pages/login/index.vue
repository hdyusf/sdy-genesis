<template>
  <div class=" pageCard">
    <div
      class="absolute left-0 top-0 -z-1"
    >
      <van-image
        class="h-full w-full"
        fit="cover"
        :src="login1"
      />
    </div>
    <Icon
      type="icon-guanbi"
      size="23"
      class="absolute right-3 top-12"
      @click="closeLogin"
    />
    <Space height="132" />
    <div class="text-2xl font-semibold">
      你好， <br>
      欢迎来到河图
    </div>
    <Space height="45" />
    <van-field
      v-model="phone"
      type="tel"
      placeholder="请输入手机号"
    />
    <van-divider class="my-0" />
    <Space height="20" />
    <van-field
      v-if="codeLogin"
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
            url="/v1/auth/sendLoginCode"
            :phone="phone"
          />
        </div>
      </template>
    </van-field>
    <template v-else>
      <van-field
        v-model="password"
        placeholder="请输入密码"
        :type="passwordShow ? 'text' : 'password'"
        :right-icon="passwordShow ? 'eye' : 'closed-eye'"
        @click-right-icon="() => passwordShow = !passwordShow"
      >
        <template #button>
          <div class="flex items-center">
            <Space
              height="12"
              width="1"
              background-color="#D8D8D8"
            />
            <Space width="12" />
            <div
              class="text-sm text-grayTip"
              @click="() => $router.push('/login/forget')"
            >
              忘记密码
            </div>
          </div>
        </template>
      </van-field>
      <van-divider class="my-0" />
      <Space height="25" />
      <van-field
        v-model="imageCode"
        type="text"
        placeholder="请输入图片验证"
      >
        <template #button>
          <van-image
            :width="parseInt($pxToPxRatio(69), 10)"
            :height="parseInt($pxToPxRatio(25), 10)"
            fit="fill"
            :src="imageCodeUrl"
            @click="getImageCode"
          />
        </template>
      </van-field>
    </template>
    <van-divider class="my-0" />
    <Space height="25" />
    <div class="flex items-center">
      <van-checkbox
        v-model="checked"
        class=" h-min"
      >
        <template #icon="props">
          <img
            class="img-icon w-3.5 h-3.5"
            :src="props.checked ? login2 : login3"
          >
        </template>
      </van-checkbox>
      <Space width="4" />
      <div
        class="text-xs2 text-grayDefault"
      >
        我已阅读并同意<span
          class="text-blueDefault"
          @click="() => $router.push('/content/userAgreement')"
        >《用户协议》</span>和<span class="text-blueDefault">《隐私协议》</span>
      </div>
    </div>
    <Space height="59" />
    <van-button
      type="danger"
      round
      :disabled="submitDisabled"
      :loading="loading"
      @click="submit"
    >
      登录
    </van-button>
    <Space height="25" />
    <div
      class="text-center text-blueDefault text-xs2"
      @click="() => codeLogin = !codeLogin"
    >
      切换{{ codeLogin ? '密码' : '验证码' }}登录
    </div>
  </div>
</template>
<script setup>
import { isMobilePhone } from 'validator';
import login1 from './images/login1.png';
import login2 from './images/login2.png';
import login3 from './images/login3.png';
import { ref, watchEffect, getCurrentInstance, computed } from 'vue';
import { Toast } from 'vant';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useStore } from 'vuex';
let router = useRouter();
let { proxy }  = getCurrentInstance();
let store = useStore();

store.commit('reset');

const phone = ref('');
const code = ref('');
const imageCode = ref('');
const password = ref('');
const checked = ref(true);
let codeLogin = ref(true);
let passwordShow = ref(false);
watchEffect(() => {
  if (codeLogin.value) {
    imageCode.value = '';
    password.value = '';
  } else {
    code.value = '';
    getImageCode();
  }
});

let imageCodeOrigin = ref('');
let imageCodeUrl = ref('');

function closeLogin() {
  router.back();
}
onBeforeRouteLeave((to, from) => {
  if (!localStorage.token) {
    if (to.meta.loginAfter) {
      router.push('/');
    }
  }
});

let submitDisabled = computed(() => {
  if (codeLogin.value) {
    return !(phone.value && code.value);
  } else {
    return !(phone.value && password.value && imageCode.value);
  }
});

function getImageCode() {
  proxy.$http('get', '/v1/auth/code', {})
    .then(res => {
      imageCodeOrigin.value = res.data.uuid;
      imageCodeUrl.value = res.data.img;
    });
}

let loading = ref(false);
let submit = proxy.$debounce(() => {
  if (!checked.value) {
    Toast('请勾选用户协议和隐私协议');
    return;
  }
  if (!isMobilePhone(phone.value, ['zh-CN'])) {
    Toast('请输入正确的手机号');
    return;
  }
  loading.value = true;
  proxy.$http('post', '/v1/auth/login', {
    'code': code.value,
    'imgCode': imageCode.value,
    'password': password.value,
    'phone': phone.value,
    'uuid': imageCodeOrigin.value
  })
    .then(async res => {
      let token = res.data.token;
      localStorage.token = token;
      let userinfo = await store.dispatch('getUserinfo');
      Toast.success('登录成功');
      if (userinfo.isPassWord) {
        router.push('/');
      } else {
        router.push('/tabbar/user/set/loginPassword?type=login');
      }
    }).thenError(res => {
      Toast(res.msg);
      getImageCode();
    }).all(res => {
      loading.value = false;
    });
});
</script>
<style lang="less" scoped>
</style>
