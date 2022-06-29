import { createApp } from 'vue';
import App from '@/App.vue';
import '@/utils/styles/reset.less';
import '@/utils/styles/tailwindcssBase.css';
import { Toast } from 'vant';

const app = createApp(App);

import router from '@/router/index.js';
app.use(router);

import store from '@/store';
app.use(store);

import components from '@/components/index.js';
app.use(components);

import vueConfig from '@/utils/vue/index.js';
app.use(vueConfig);

import '@/utils/styles/tailwindcss.css';
import '@/utils/styles/vant.less';
import 'animate.css';

import {
  updateLocalStorageStorage,
  $localStorage,
} from '@/utils/common';
window.$localStorage = $localStorage;

app.mount('#app');

// html5+ App包配置
document.addEventListener('plusready', () => {
  updateLocalStorageStorage();
  let webview = plus.webview.currentWebview();
  let nextBack = false;
  plus.key.addEventListener('backbutton', () => {
    webview.canBack((e) => {
      if (e.canBack) {
        router.go(-1);
      } else {
        if (!nextBack) {
          nextBack = true;
          Toast({
            message: '再按一次退出应用',
            duration: 1000,
          });
          setTimeout(() => {
            nextBack = false;
          }, 1000);
        } else {
          plus.runtime.quit();
        }
      }
    });
  });
  const AppSaveImage = (url) => {
    let downloadImage = plus.downloader.createDownload(
      url,
      { filename: '_doc/update/' },
      (d, status) => {
        if (status === 200) {
          let filepath = plus.io.convertLocalFileSystemURL(
            d.filename,
          );
          plus.gallery.save(filepath);
          Toast('保存成功');
          // 删除
          plus.io.resolveLocalFileSystemURL(
            filepath,
            (entry) => {
              entry.remove(
                (e) => {},
                (e) => {},
              );
            },
            (e) => {},
          );
        } else {
          Toast(`保存文件发生错误: ${status}`);
        }
      },
    );
    downloadImage.start();
  };
  window.AppSaveImage = AppSaveImage;
});
