<template>
  <NavBar
    title="编辑昵称"
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
        :loading="loading"
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
        class="fixedLimit"
        type="text"
        placeholder="请输入用户名称"
        show-word-limit
        maxlength="24"
      />
    </div>
    <Space height="14" />
    <!-- <div class=" pl-4 text-grayDefault text-xs2">
      请设置2-24个字符，不包括@&lt;>/等无效字符哦
    </div> -->
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
  input.value = store.state.userinfo.nickName;
});

let loading = ref(false);
let submit = proxy.$debounce(() => {
  loading.value = true;
  proxy.$http('post', '/v1/modifyUser/modifyUserInfo', {
    'descr': '',
    'nickName': input.value,
    'sex': '',
    'type': 1,
  })
    .then(res => {
      Toast.success('修改成功');
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
