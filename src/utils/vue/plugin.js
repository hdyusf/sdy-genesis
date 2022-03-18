import Vant from 'vant';
import 'vant/lib/index.css';
import VueClipboard from 'vue3-clipboard';

export default function install(app) {
  app.use(Vant);
  app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  });
}
