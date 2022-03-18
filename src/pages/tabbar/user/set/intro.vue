<template>
  <NavBar
    title="编辑简介"
    :go-back="false"
  >
    <template #left>
      <div
        class=" text-base text-grayTip"
        @click="() => $router.back()"
      >
        取消
      </div>
    </template>
    <template #right>
      <div
        class=" text-base text-redTitle"
        @click="submit"
      >
        保存
      </div>
    </template>
  </NavBar>
  <div class=" pageCard-sm">
    <Space height="10" />
    <div class="bg-white rounded-lg2 px-4 text-sm">
      <van-field
        v-model="input"
        type="textarea"
        :autosize="{ minHeight: 100 }"
        placeholder="编辑简介"
        show-word-limit
        maxlength="100"
      />
    </div>
  </div>
</template>
<script setup>
import { Toast } from 'vant';
import { ref, getCurrentInstance, watchEffect } from 'vue';
import { useStore } from 'vuex';
let {proxy} = getCurrentInstance();
let store = useStore();
let input = ref('');

watchEffect(() => {
  input.value = store.state.userinfo.descr;
});

let submit = proxy.$debounce(() => {
  proxy.$http('post', '/v1/modifyUser/modifyUserInfo', {
    'descr': input.value,
    'nickName': '',
    'sex': '',
    'type': 3,
  })
    .then(res => {
      Toast.success('修改成功');
      store.dispatch('getUserinfo');
    }).thenError(res => {
      Toast(res.msg);
    });
});
</script>
<style lang="less" scoped>
</style>
