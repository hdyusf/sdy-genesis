<template>
  <div class="appLayout flex flex-col relative h-full">
    <router-view />
  </div>
</template>

<script setup>
import { watchEffect, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import router from './router';
import { Dialog } from 'vant';
let {proxy} = getCurrentInstance();
let store = useStore();

watchEffect(() => {
  localStorage.setItem('vuex', JSON.stringify(store.state));
});
store.replaceState(JSON.parse(localStorage.vuex));

if (localStorage.getItem('token')) {
  store.dispatch('getUserinfo');
}

document.addEventListener('plusready', () => {
  router.replace('/startAfter');
  setTimeout(() => {
    checkUpdateApp();
  }, 5000);
});
function checkUpdateApp() {
  proxy.$http('get', '/v1/service', {})
    .then(res => {
      let downloadUrl = res.data.downloadUrl;
      let version = res.data.version;
      plus.runtime.getProperty(plus.runtime.appid, inf => {
        let appVersionNumber = parseInt(inf.version.split('.').join(''), 10);
        let getVersionNumber = parseInt(version.split('.').join(''), 10);
        if (getVersionNumber > appVersionNumber) {
          Dialog.confirm({
            message: '有新版本，是否更新？',
            theme: 'round-button',
          })
            .then(() => {
              updateApp(downloadUrl);
            })
            .catch(() => {
              plus.runtime.quit();
            });
        };
      });
    }).thenError(res => Toast(res.msg));
}

function updateApp(downloadUrl) {
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
