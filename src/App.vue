<template>
  <div class="appLayout flex flex-col relative h-full">
    <router-view />
  </div>
</template>

<script setup>
import { watchEffect, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
let {proxy} = getCurrentInstance();
let store = useStore();
watchEffect(() => {
  localStorage.setItem('vuex', JSON.stringify(store.state));
});
store.replaceState(JSON.parse(localStorage.vuex));

proxy.$http('get', '/v1/service', {})
  .then(res => {
    let downloadUrl = res.data.downloadUrl;
    let version = res.data.version;
    document.addEventListener('plusready', () => {
      plus.runtime.getProperty(plus.runtime.appid, inf => {
        let appVersion = inf.version;
        if (appVersion !== version) {
          plus.nativeUI.showWaiting('下载更新文件...');
          plus.downloader
            .createDownload(downloadUrl, { filename: '_doc/update/' }, (d, status) => {
              if (status === 200) {
                plus.runtime.install(
                  d.filename,
                  {},
                  () => {
                    plus.nativeUI.closeWaiting();
                    plus.nativeUI.alert('版本更新成功', () => {
                      plus.runtime.restart();
                    });
                  },
                  e => {
                    plus.nativeUI.closeWaiting();
                    plus.nativeUI.alert('安装更新文件失败');
                  },
                );
              } else {
                plus.nativeUI.alert('下载更新文件失败！');
                plus.nativeUI.closeWaiting();
              }
            })
            .start();
        }
      });
    });
  }).thenError(res => Toast(res.msg));
</script>

<style lang="less">
html,
body {
  font-size: 16px;
  height: 100%;
}
#app {
  position: relative;
  z-index: 1;
  font-size: 15px;
  height: 100%;
  color: #2e384d;
  font-weight: 400;
}
</style>
