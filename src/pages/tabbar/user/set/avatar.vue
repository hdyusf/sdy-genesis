<template>
  <div class=" h-full flex items-center relative bg-black/95">
    <van-icon
      name="arrow-left"
      class="absolute z-1 left-4 top-8 text-white text-2xl"
      @click="() => $router.back()"
    />
    <van-image
      class="w-full"
      :height="parseInt($pxToPxRatio(410), 10)"
      fit="contain"
      :src="store.state.userinfo?.headPic || '123'"
      :icon-size="parseInt($pxToPxRatio(410), 10)"
      :error-icon="a2"
    />
    <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2">
      <van-uploader :after-read="afterRead">
        <div
          class="px-16 py-3 flex items-center justify-center rounded-lg2 ring-1 ring-gray-700 whitespace-nowrap text-white text-sm"
        >
          更换头像
        </div>
      </van-uploader>
    </div>
  </div>
</template>
<script setup>
import a2 from '../images/a2.png';
import { ref, getCurrentInstance } from 'vue';
import { Toast } from 'vant';
import { useStore } from 'vuex';
let store = useStore();
let {proxy} = getCurrentInstance();

const afterRead = (file) => {
  proxy.$http('file', '/v1/cdn/uploadImg', {
    file: file.file
  }).then((res) => {
    proxy.$http('post', '/v1/modifyUser/modifyHeadPic', {
      headPic: res.data,
    })
      .then(res => {
        Toast.success('修改成功');
        store.dispatch('getUserinfo');
      }).thenError(res => {
        Toast(res.msg);
      });
  });
};
</script>
<style lang="less" scoped>
</style>
