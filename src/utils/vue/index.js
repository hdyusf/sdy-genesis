import plugin from '@/utils/vue/plugin.js';
import prototype from '@/utils/vue/prototype.js';
import '../http';

export default function install(app) {
  app.use(plugin);
  app.use(prototype);
}
