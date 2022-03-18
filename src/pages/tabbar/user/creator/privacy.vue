<template>
  <NavBar
    title="隐私设置"
  />
  <div class=" pageCard-sm">
    <Space height="15" />
    <div class="card px15 py-5">
      <div
        class="flex items-center justify-between text-sm"
        @click="() => switchSelect(0)"
      >
        <div>公开</div>
        <Icon
          v-if="selectIndex === 0"
          type="icon-check"
          size="16"
        />
      </div>
      <div
        class="flex items-center justify-between text-sm mt-6"
        @click="() => switchSelect(1)"
      >
        <div>隐私</div>
        <Icon
          v-if="selectIndex === 1"
          type="icon-check"
          size="16"
        />
      </div>
      <div
        class="flex items-center justify-between text-sm mt-6"
        @click="() => switchSelect(2)"
      >
        <div>仅粉丝可见</div>
        <Icon
          v-if="selectIndex === 2"
          type="icon-check"
          size="16"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, watchEffect } from 'vue';
import { Toast } from 'vant';
import { useStore } from 'vuex';
let selectIndex = ref(-1);
let {proxy} = getCurrentInstance();
let store = useStore();

function getInfo() {
  proxy.$http('post', '/v1/artist/artistInfo', {})
    .then(res => {
      selectIndex.value = res.data.homepage;
    }).thenError(res => Toast(res.msg));
}
getInfo();

function switchSelect(res) {
  if (selectIndex.value === res) return;
  selectIndex.value = res;
  proxy.$http('post', '/v1/modifyUser/modifyHomepage', {
    'homepage': res,
  })
    .then(res => {
      Toast.success('修改成功');
    }).thenError(res => {
      Toast(res.msg);
    });
}
</script>
<style lang="less" scoped>
</style>
