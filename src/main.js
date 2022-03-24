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


app.mount('#app');


// html5+ App包配置
document.addEventListener('plusready', () => {
  plus.key.addEventListener('backbutton', () => {
    router.back();
  });
  const AppSaveImage = url => {
    let downloadImage = plus.downloader.createDownload(url, { filename: '_doc/update/' }, (d, status) => {
      if (status === 200) {
        let filepath = plus.io.convertLocalFileSystemURL(d.filename);
        plus.gallery.save(filepath);
        Toast('保存成功');
        // 删除
        plus.io.resolveLocalFileSystemURL(
          filepath,
          entry => {
            entry.remove(
              e => {},
              e => {},
            );
          },
          e => {},
        );
      } else {
        Toast(`保存文件发生错误: ${status}`);
      }
    });
    downloadImage.start();
  };
  window.AppSaveImage = AppSaveImage;
});
