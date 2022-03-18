<template>
  <NavBar title="编辑性别" />
  <div class=" pageCard-sm">
    <Space height="10" />
    <div class="card px15 py-5">
      <div
        class="flex items-center justify-between text-sm"
        @click="() => switchSex(1)"
      >
        <div>男</div>
        <Icon
          v-if="selectIndex === 1"
          type="icon-check"
          size="16"
        />
      </div>
      <div
        class="flex items-center justify-between text-sm mt-6"
        @click="() => switchSex(2)"
      >
        <div>女</div>
        <Icon
          v-if="selectIndex === 2"
          type="icon-check"
          size="16"
        />
      </div>
    </div>
    <Space height="14" />
    <div class=" pl-4 text-grayDefault text-xs2">
      请选择你的性别
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, watchEffect } from 'vue';
import { Toast } from 'vant';
import { useStore } from 'vuex';
let selectIndex = ref(0);
let {proxy} = getCurrentInstance();
let store = useStore();

watchEffect(() => {
  selectIndex.value = store.state.userinfo.sex;
});

function switchSex(sex) {
  if (selectIndex.value === sex) return;
  selectIndex.value = sex;
  proxy.$http('post', '/v1/modifyUser/modifyUserInfo', {
    'descr': '',
    'nickName': '',
    'sex': sex,
    'type': 2,
  })
    .then(res => {
      Toast.success('修改成功');
      store.dispatch('getUserinfo');
    }).thenError(res => {
      Toast(res.msg);
    });
}
</script>
<style lang="less" scoped>
</style>
