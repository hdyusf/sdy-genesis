<template>
  <div
    class="tabbarLayout bg-grayBg pageFull"
    :class="{tabbarShow: store.state.tabbar}"
  >
    <router-view />
    <div
      v-if="tabbar"
      class="tabbarBox"
    >
      <div
        v-for="(item, index) of tabbarList"
        :key="index"
        class="flex items-center justify-center flex-auto relative"
        :class="{ 'active': tabbarActive === index }"
        @click="switchTabbar(index)"
      >
        <van-image
          :show-loading="false"
          :src="tabbarActive === index ? item.activeIcon : item.icon"
          :width="$pxToVw(25)"
          :height="$pxToVw(25)"
          fit="contain"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import a1 from './images/a1.png';
import a2 from './images/a2.png';
import a3 from './images/a3.png';
import a4 from './images/a4.png';
import a5 from './images/a5.png';
import a6 from './images/a6.png';
let router = useRouter();
let route = useRoute();
let store = useStore();

let tabbar = computed(() => {
  return store.state.tabbar;
});
let tabbarList = [
  {
    icon: a6,
    activeIcon: a5,
    href: '/tabbar/home',
  },
  {
    icon: a2,
    activeIcon: a1,
    href: '/tabbar/market',
  },
  {
    icon: a4,
    activeIcon: a3,
    href: '/tabbar/user',
  },
];
let tabbarActive = ref(0);
let path = route.path;
function switchTabbar(index) {
  tabbarActive.value = index;
  router.push(tabbarList[index].href);
}

function checkShowTabbar(path) {
  tabbarList.forEach((item, index) => {
    if (item.href === path) {
      tabbarActive.value = index;
    }
    if (path === '/') {
      tabbarActive.value = 0;
    }
  });

  let pathArr = tabbarList.map(item => {
    return item.href;
  });
  if (pathArr.includes(path) || path === '/') {
    store.state.tabbar = true;
  } else {
    store.state.tabbar = false;
  }
}
checkShowTabbar(path);
onBeforeRouteUpdate((to, from) => {
  checkShowTabbar(to.path);
});
</script>
<style lang="less" scoped>
.tabbarLayout {
  &.tabbarShow {
    padding-bottom: 87px;
  }
}
.tabbarBox {
  position: fixed;
  bottom: 20px;
  left: 25px;
  z-index: 2;
  width: 325px;
  height: 50px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 5px 10px 0px rgba(235, 235, 235, 0.5),
    inset 0px 1px 7px 0px rgba(255, 249, 249, 1);
  border-radius: 25px;
  display: flex;
  > div.active {
    &:after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 50%;
      z-index: 1;
      transform: translateX(-50%);
      width: 23px;
      height: 16px;
      background: url("./images/a7.png") no-repeat center;
      background-size: contain;
    }
  }
}
</style>
