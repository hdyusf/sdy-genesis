<template>
  <NavBar
    title="设置"
  />
  <div class=" pageCard-sm">
    <Space height="25" />
    <van-image
      round
      class="mx-auto"
      :width="parseInt($pxToPxRatio(90), 10)"
      :height="parseInt($pxToPxRatio(90), 10)"
      fit="cover"
      :src="userinfo.headPic || '123'"
      :icon-size="parseInt($pxToPxRatio(90), 10)"
      :error-icon="a2"
      @click="() => $router.push('/tabbar/user/set/avatar')"
    />
    <Space height="30" />
    <div class=" bg-white rounded-lg2 px-4 py-5 grid gap-y-6 cardShadow">
      <Line
        v-for="(item, index) of list"
        :key="index"
        :title="item.title"
        :value="item.value"
        :right-icon="item.rightIcon"
        @click="() => clickList(item)"
      />
    </div>
    <Space height="15" />
    <div class=" bg-white rounded-lg2 px-4 py-5 grid gap-y-6 cardShadow">
      <Line
        v-for="(item, index) of list2"
        :key="index"
        :title="item.title"
        :value="item.value"
        :right-icon="item.rightIcon"
        @click="() => clickList(item)"
      />
    </div>
    <Space height="15" />
    <div class=" bg-white rounded-lg2 px-4 py-5 grid gap-y-6 cardShadow">
      <Line
        v-for="(item, index) of list3"
        :key="index"
        :title="item.title"
        :value="item.value"
        :right-icon="item.rightIcon"
        @click="() => clickList(item)"
      />
    </div>
    <Space height="20" />
    <van-button
      plain
      type="defalut"
      class=" rounded-lg2"
      @click="logout"
    >
      退出登录
    </van-button>
    <Space height="20" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue';
import a2 from '@/assets/images/a5.png';
import Line from '../component/Line.vue';
import { logout } from '@/utils/common';
import { useStore } from 'vuex';
import { Toast } from 'vant';
let {proxy} = getCurrentInstance();
let store = useStore();
let list = ref([
  {
    title: '昵称',
    value: '',
    rightIcon: true,
    auth: false,
    href: '/tabbar/user/set/username',
  },
  {
    title: '性别',
    value: '',
    rightIcon: true,
    auth: false,
    href: '/tabbar/user/set/sex',
  },
  {
    title: '简介',
    value: '他好像对元宇宙没什么了解',
    rightIcon: true,
    auth: false,
    href: '/tabbar/user/set/intro',
  },
]);
let list2 = ref([
  {
    title: '实名认证',
    value: '',
    rightIcon: true,
    auth: false,
    href: '/tabbar/user/set/auth',
  },
  {
    title: '交易密码',
    value: '',
    rightIcon: true,
    auth: false,
    href: '/tabbar/user/set/payPassword',
  },
  {
    title: '登录密码',
    value: '',
    rightIcon: true,
    auth: false,
    href: '/tabbar/user/set/loginPassword',
  },
]);
let list3 = ref([
  {
    title: '第三方支付设置',
    value: '',
    rightIcon: true,
    auth: false,
    href: '/tabbar/user/set/threePay',
  },
  {
    title: '银行卡设置',
    value: '',
    rightIcon: true,
    auth: true,
    href: '/tabbar/user/set/bankPay',
  },
]);
let userinfo = ref(store.state.userinfo || {});
store.dispatch('getUserinfo').then((res) => {
  userinfo.value = res;
  list.value[0].value = userinfo.value.nickName || userinfo.value.phone;
  list.value[1].value = userinfo.value.sex === 0 ? '未设置' : userinfo.value.sex === 1 ? '男' : '女';
  if (userinfo.value.descr) {
    list.value[2].value = userinfo.value.descr;
  }

  list2.value[0].value = (() => {
    let r = '';
    switch(userinfo.value.isAuthStatus) {
      case 0:
        r = '未认证';
        break;
      case 1:
        r = '审核中';
        break;
      case 2:
        r = '已认证';
        break;
      case 3:
        r = '认证失败';
        break;
      case 4:
        r = '认证作废';
        break;
    }
    return r;
  })();
  if (userinfo.value.isAuthStatus === 1 || userinfo.value.isAuthStatus === 2) {
    list2.value[0].rightIcon = false;
    list2.value[0].href = '';
  }
  list2.value[1].value = userinfo.value.isPayPassWord ? '' : '未设置';
  list2.value[2].value = userinfo.value.isPassWord ? '' : '未设置';
});

function clickList(item) {
  if (item.auth && store.state.userinfo.isAuthStatus !== 2) {
    Toast('请先实名认证');
    return;
  }
  proxy.$router.push(item.href);
}
</script>
<style lang="less" scoped>
</style>
