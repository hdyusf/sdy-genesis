import { createStore } from 'vuex';
import { http } from '@/utils/common';

function getDefaultState() {
  return {
    tabbarActive: 0,
    tabbar: true,
    userinfo: {},
    payTime: 30,
  };
}
export default createStore({
  state: getDefaultState(),
  mutations: {
    increment(state) {
      state.count++;
    },
    reset(state) {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    async getUserinfo(context) {
      let res = await http('post', '/v1/user/userInfo', {});
      context.state.userinfo = res.data;
      return res.data;
    },
    async getPayTime(context) {
      let res = await http('post', '/v1/order/orderOverMinute', {});
      context.state.payTime = res.data;
      return res.data;
    }
  },
});
