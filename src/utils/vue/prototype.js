import * as commonAll from '@/utils/common';
import * as dayjs from 'dayjs';
import debounceInit from 'lodash/debounce';
import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';

let debounce = (func, wait = 500, first = true) => {
  let config = {};
  if (first) {
    config = {
      leading: true,
      trailing: false,
    };
  }
  return debounceInit(func, wait, config);
};

export default function install(app) {
  for (let [name, value] of Object.entries(commonAll)) {
    app.config.globalProperties[`$${name}`] = value;
  }
  app.config.globalProperties.$dayjs = dayjs;
  app.config.globalProperties.$debounce = debounce;
  app.config.globalProperties.$throttle = throttle;
  app.config.globalProperties.$cloneDeep = cloneDeep;
}
