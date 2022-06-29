<template>
  <div class="appLayout flex flex-col relative h-full">
    <router-view />
    <van-popup
      v-model:show="updatePopup"
      :close-on-click-overlay="false"
      round
    >
      <div class="px-9 card w-80 text-blackDefault">
        <Space height="37" />
        <div class="text-base font-semibold text-center">
          版本更新
        </div>
        <Space height="20" />
        <div class="text-sm text-grayTip text-center">
          1. 优化已知问题<br>
          2. 提升用户体验
        </div>
        <Space height="35" />
        <van-button
          type="danger"
          block
          round
          @click="updateApp"
        >
          立即更新 ({{ version }})
        </van-button>
        <Space height="30" />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { updateLocalStorageStorage } from '@/utils/common.js';
import {
  watchEffect,
  getCurrentInstance,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
let { proxy } = getCurrentInstance();
let store = useStore();
let router = useRouter();

watch(
  () => router.currentRoute.value,
  (to, from) => {
    if (to && from) {
      if (to.path === '/' && from.path === '/start') {
        checkUpdateApp();
      }
    }
  },
  { immediate: true, deep: true },
);

watchEffect(() => {
  $localStorage.setItem(
    'vuex',
    JSON.stringify(store.state),
  );
});
store.replaceState(
  JSON.parse($localStorage.getItem('vuex')),
);

if ($localStorage.getItem('token')) {
  store.dispatch('getUserinfo');
}

document.addEventListener('plusready', () => {
  router.replace('/start');
});

const updatePopup = ref(false);
const version = ref('');
const downloadUrl = ref('');
function checkUpdateApp() {
  proxy
    .$http('get', '/v1/service', {})
    .then((res) => {
      downloadUrl.value = res.data.downloadUrl;
      version.value = res.data.version;
      plus.runtime.getProperty(
        plus.runtime.appid,
        (inf) => {
          let appVersionNumber = parseInt(
            inf.version.split('.').join(''),
            10,
          );
          let getVersionNumber = parseInt(
            version.value.split('.').join(''),
            10,
          );
          if (getVersionNumber > appVersionNumber) {
            // app是否需要更新
            updatePopup.value = true;
          } else {
            // 查看页面是否需要更新
            let pageVersion = parseInt(
              res.data.pageVersion.split('.').join(''),
              10,
            );
            let storagePageVersion =
              $localStorage.getItem('pageVersion');
            if (storagePageVersion) {
              storagePageVersion = parseInt(
                storagePageVersion.split('.').join(''),
                10,
              );
              if (pageVersion > storagePageVersion) {
                plus.cache.clear();
                updateLocalStorageStorage(true);
                $localStorage.setItem(
                  'pageVersion',
                  pageVersion,
                );
                // Dialog.confirm({
                //   message: '有新版本，是否更新？',
                //   theme: 'round-button',
                // })
                //   .then(() => {
                //     updateApp(downloadUrl);
                //   })
                //   .catch(() => {
                //     plus.runtime.quit();
                //   });
              }
            } else {
              $localStorage.setItem(
                'pageVersion',
                pageVersion,
              );
            }
          }
        },
      );
    })
    .thenError((res) => Toast(res.msg));
}

function updateApp() {
  plus.nativeUI.showWaiting('下载更新文件...');
  plus.downloader
    .createDownload(
      downloadUrl.value,
      { filename: '_doc/update/' },
      (d, status) => {
        if (status === 200) {
          plus.runtime.install(
            d.filename,
            {},
            () => {
              plus.cache.clear();
              plus.nativeUI.closeWaiting();
              plus.nativeUI.alert('版本更新成功', () => {
                plus.runtime.restart();
              });
            },
            (e) => {
              plus.nativeUI.closeWaiting();
              plus.nativeUI.alert('安装更新文件失败');
            },
          );
        } else {
          plus.nativeUI.alert('下载更新文件失败！');
          plus.nativeUI.closeWaiting();
        }
      },
    )
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
