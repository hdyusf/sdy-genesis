<template>
  <NavBar
    title="编辑介绍"
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
        type="textarea"
        :autosize="{ minHeight: 100 }"
        placeholder="编辑介绍"
        show-word-limit
        maxlength="100"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch, watchEffect, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Toast } from 'vant';
let input = ref('');
let {proxy} = getCurrentInstance();
let store = useStore();

function getInfo() {
  proxy.$http('post', '/v1/artist/artistInfo', {})
    .then(res => {
      input.value = res.data.descr;
    }).thenError(res => Toast(res.msg));
}
getInfo();

let loading = ref(false);
let submit = proxy.$debounce(() => {
  loading.value = true;
  proxy.$http('post', '/v1/artist/modify', {
    'backImg': '',
    'descr': input.value,
    'type': 2
  })
    .then(res => {
      Toast.success('修改成功');
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
