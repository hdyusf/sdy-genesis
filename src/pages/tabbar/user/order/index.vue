<template>
  <NavBar
    :go-back="true"
    :title="route.query.origin === 'buy' ? '订单详情' : '藏品详情'"
  />
  <div
    :key="$route.type"
    class="pageCard-sm"
    :class="orderBuy ? 'pb-24' : 'pb-7'"
  >
    <Space height="11" />
    <div class="showCard">
      <div
        class="showCardBg"
        :style="{
          backgroundImage: `url('${detail.fileUrl}')`,
        }"
      />
      <van-image
        :src="detail.fileUrl"
        class="rounded-3xl overflow-hidden"
        fit="contain"
        :width="$pxToVw(345)"
        :height="$pxToVw(345)"
      />
      <div
        v-if="detail.certifyUrl"
        class="lookNumberSid"
        @click="() => (numberSid = true)"
      >
        查看数字证书
      </div>
    </div>
    <Space height="15" />
    <div class="flex items-center justify-between px-4">
      <div
        class="text-base font-semibold text-blackTitle max-w-bai3 truncate"
      >
        {{ detail.name }}
      </div>
      <span
        class="text-lg font-semibold text-redTitle tracking-wider"
      >
        ¥ {{ $formatPrice(detail.price, 2, true) }}
      </span>
    </div>
    <Space height="11" />
    <div
      class="rounded-lg2 bg-white shadow-md shadow-gray-100 py-5 px-4 text-grayCard text-xs2 grid gap-3"
    >
      <div class="flex items-center justify-between">
        <span>艺术家</span>
        <span class="flex items-center">
          <van-image
            :width="parseInt($pxToPxRatio(18), 10)"
            :height="parseInt($pxToPxRatio(18), 10)"
            fit="cover"
            class="rounded-full overflow-hidden mr-2"
            :src="detail.artistHeadPic || '123'"
            :icon-size="parseInt($pxToPxRatio(18), 10)"
            :error-icon="a5"
          />
          <div class="max-w-bai2 truncate">
            {{ detail.artistNickName }}
          </div>
        </span>
      </div>
      <div class="flex items-center justify-between">
        <span>市场类型</span>
        <span>{{ detail.marketType }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>出售类型</span>
        <span>{{ detail.sellType }}</span>
      </div>
      <div
        class="flex items-center justify-between"
      >
        <span>藏品类型</span>
        <span class=" max-w-bai3 truncate">{{ detail.seriesType }}</span>
      </div>
      <div
        v-if="detail.seriesType==='系列'"
        class="flex items-center justify-between"
      >
        <span>系列名称</span>
        <span class=" max-w-bai3 truncate">{{ detail.seriesName }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>数量</span>
        <span class=" text-orangeTip">x{{ detail.number }}</span>
      </div>
      <template
        v-if="
          !(publishVerify || publishCancel || publishReject)
        "
      >
        <div class="flex items-center justify-between">
          <span class="flex items-center">
            合约地址
            <van-popover
              v-model:show="sitePopover"
              theme="dark"
              placement="top-start"
            >
              智能合约是存储在区块链网络中的一段代码，它界定了各方使用合同的条件。
              所以如果需要的条件被满足，就被自动执行。合约地址是指该智能合约的合同编号（ID）
              <template #reference>
                <Icon
                  class="ml-1"
                  type="icon-shuoming"
                  size="12"
                />
              </template>
            </van-popover>
          </span>
          <span class="flex items-center">
            {{ formatSite(detail.contractAddress) }}
            <Icon
              class="ml-1"
              type="icon-fuzhi"
              size="12"
              @click="() => copy(detail.contractAddress)"
            />
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="flex items-center">
            区块链存证ID
            <van-popover
              v-model:show="idPopover"
              theme="dark"
              placement="right"
            >
              NFT在链上的唯一序号
              <template #reference>
                <Icon
                  class="ml-1"
                  type="icon-shuoming"
                  size="12"
                />
              </template>
            </van-popover>
          </span>
          <span class="flex items-center text-orangeTitle">
            <span @click="clickTokenId">{{ formatSite(detail.tokenId) }}</span>
            <Icon
              class="ml-1"
              type="icon-fuzhi"
              size="12"
              @click="() => copy(detail.tokenId)"
            />
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="flex items-center">
            永久存储哈希
            <van-popover
              v-model:show="hashPopover"
              theme="dark"
              placement="right"
            >
              永久存储Filecoin的唯一哈希
              <template #reference>
                <Icon
                  class="ml-1"
                  type="icon-shuoming"
                  size="12"
                />
              </template>
            </van-popover>
          </span>
          <span class="flex items-center">
            <span @click="clickHash">{{ formatSite(detail.hash) }}</span>
            <Icon
              class="ml-1"
              type="icon-fuzhi"
              size="12"
              @click="() => copy(detail.hash)"
            />
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span>认证标准</span>
          <span>{{ detail.chainContract }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>认证网络</span>
          <span>{{ detail.chainName }}</span>
        </div>
      </template>
      <template v-if="orderBuy">
        <van-divider class="my-3" />
        <div class="flex items-center justify-between">
          <span>订单状态</span>
          <span class="text-orangeTip">待支付</span>
        </div>
        <div class="flex items-center justify-between">
          <span>订单号</span>
          <span class=" max-w-bai3 truncate">{{ detail.id }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>创建时间</span>
          <span>{{ detail.createTime }}</span>
        </div>
        <div
          class="fixedButton"
          @click="clickPaySubmit"
        >
          <div
            class="flex items-center w-52 justify-center"
          >
            <div class="text-grayDefault text-xs">
              总金额：
            </div>
            <span
              class="text-lg font-semibold text-redTitle tracking-wider"
            >¥ {{ $formatPrice(detail.orderMoney, 2, true) }}</span>
          </div>
          <span>支付</span>
        </div>
      </template>
      <template v-if="orderSuccess">
        <van-divider class="my-3" />
        <div class="flex items-center justify-between">
          <span>订单状态</span>
          <span>已完成</span>
        </div>
        <div class="flex items-center justify-between">
          <span>支付方式</span>
          <span>{{ detail.payType }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>订单号</span>
          <span class=" max-w-bai3 truncate">{{ detail.id }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>支付时间</span>
          <span>{{ detail.payTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>创建时间</span>
          <span>{{ detail.createTime }}</span>
        </div>
      </template>
      <template v-if="orderCancel">
        <van-divider class="my-3" />
        <div class="flex items-center justify-between">
          <span>订单状态</span>
          <span>已取消</span>
        </div>
        <div class="flex items-center justify-between">
          <span>订单号</span>
          <span class=" max-w-bai3 truncate">{{ detail.id }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>取消时间</span>
          <span>{{ detail.cancelTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>创建时间</span>
          <span>{{ detail.createTime }}</span>
        </div>
      </template>
      <template v-if="publishVerify">
        <van-divider class="my-3" />
        <div class="flex items-center justify-between">
          <span>藏品状态</span>
          <span class="text-orangeTip">审核中</span>
        </div>
        <!-- <div class="flex items-center justify-between">
          <span>订单号</span>
          <span class=" max-w-bai3 truncate">{{ detail.id }}</span>
        </div> -->
        <div class="flex items-center justify-between">
          <span>创建时间</span>
          <span>{{ detail.createTime }}</span>
        </div>
      </template>
      <template v-if="publishPublish">
        <van-divider class="my-3" />
        <div class="flex items-center justify-between">
          <span>藏品状态</span>
          <span class="text-blueDefault">发布中</span>
        </div>
        <!-- <div class="flex items-center justify-between">
          <span>订单号</span>
          <span class=" max-w-bai3 truncate">{{ detail.id }}</span>
        </div> -->
        <div
          v-if="detail.cochainTime"
          class="flex items-center justify-between"
        >
          <span>上链时间</span>
          <span>{{ detail.cochainTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>审核时间</span>
          <span>{{ detail.auditTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>创建时间</span>
          <span>{{ detail.createTime }}</span>
        </div>
      </template>
      <template v-if="publishCancel">
        <van-divider class="my-3" />
        <div class="flex items-center justify-between">
          <span>藏品状态</span>
          <span>已取消</span>
        </div>
        <!-- <div class="flex items-center justify-between">
          <span>订单号</span>
          <span class=" max-w-bai3 truncate">{{ detail.id }}</span>
        </div> -->
        <div class="flex items-center justify-between">
          <span>取消时间</span>
          <span>{{ detail.cancelTime }}</span>
        </div>
        <div
          v-if="detail.auditTime"
          class="flex items-center justify-between"
        >
          <span>审核时间</span>
          <span>{{ detail.auditTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>创建时间</span>
          <span>{{ detail.createTime }}</span>
        </div>
      </template>
      <template v-if="publishReject">
        <van-divider class="my-3" />
        <div class="flex items-center justify-between">
          <span>藏品状态</span>
          <span>已拒绝</span>
        </div>
        <div class="flex items-center justify-between">
          <span>拒绝原因</span>
          <span class="text-orangeTip">{{ detail.failReason }}</span>
        </div>
        <!-- <div class="flex items-center justify-between">
          <span>订单号</span>
          <span class=" max-w-bai3 truncate">{{ detail.id }}</span>
        </div> -->
        <div class="flex items-center justify-between">
          <span>拒绝时间</span>
          <span>{{ detail.auditTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>创建时间</span>
          <span>{{ detail.createTime }}</span>
        </div>
      </template>
      <template v-if="publishNomore">
        <van-divider class="my-3" />
        <div class="flex items-center justify-between">
          <span>订单状态</span>
          <span>已售罄</span>
        </div>
        <div class="flex items-center justify-between">
          <span>支付方式</span>
          <span>{{ detail.payType }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>成交时间</span>
          <span>{{ detail.payTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>上链时间</span>
          <span>{{ detail.cochainTime }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>创建时间</span>
          <span>{{ detail.createTime }}</span>
        </div>
      </template>
    </div>
  </div>
  <van-popup
    v-model:show="numberSid"
    :close-on-click-overlay="false"
    class="w-full transparent"
  >
    <div class="flex flex-col items-center px15">
      <Space height="104" />
      <div
        class="logo relative z-1 overflow-hidden rounded-xl"
      >
        <van-image
          class="absolute z-1"
          :src="logoBorder"
          fit="contain"
        />
        <div
          class="download absolute right-4 top-4 z-1 bg-black/60 w-9 h-9 rounded-full flex items-center justify-center"
          @click="downloadImage"
        >
          <Icon
            type="icon-download"
            size="20"
          />
        </div>
        <van-image
          class
          :width="$pxToVw(256)"
          :height="$pxToVw(254)"
          :src="detail.fileUrl"
          fit="cover"
        />
      </div>
      <div class="cardContent w-full -mt-28 relative">
        <van-image
          class
          :src="c1"
          fit="cover"
        />
        <div
          class="absolute top-0 left-0 z-1 px-5 text-grayCard w-full h-full text-xs2"
        >
          <Space height="131" />
          <div
            class="text-base text-blackTitle font-semibold"
          >
            藏品信息
          </div>
          <Space height="14" />
          <div class="grid gap-3">
            <div class="flex item-center justify-between">
              <span>藏品名称</span>
              <span>{{ detail.name }}</span>
            </div>
            <div class="flex item-center justify-between">
              <span>所属人</span>
              <span>{{ detail.ownerNickName }}</span>
            </div>
            <div class="flex item-center justify-between">
              <span>区块链存证ID</span>
              <span
                class="flex items-center text-orangeTitle"
              >
                {{ formatSite(detail.uuid) }}
                <!-- <Icon
                  class="ml-1"
                  type="icon-fuzhi"
                  size="12"
                  @click="() => copy()"
                /> -->
              </span>
            </div>
            <div class="flex item-center justify-between">
              <span>永久存储哈希</span>
              <span
                class="flex items-center text-orangeTitle"
              >
                {{ formatSite(detail.hash) }}
                <!-- <Icon
                  class="ml-1"
                  type="icon-fuzhi"
                  size="12"
                  @click="() => copy()"
                /> -->
              </span>
            </div>
            <div class="flex item-center justify-between">
              <span>藏品平台</span>
              <span>创世数藏</span>
            </div>
            <div class="flex item-center justify-between">
              <span>认证标准</span>
              <span>{{ detail.chainContract }}</span>
            </div>
            <div class="flex item-center justify-between">
              <span>认证网络</span>
              <span>{{ detail.chainName }}</span>
            </div>
            <div class="flex item-center justify-between">
              <span>存证时间</span>
              <span>{{ detail.cochainTime }}</span>
            </div>
          </div>
          <Space height="22" />
          <div
            class="text-base text-blackTitle font-semibold"
          >
            藏品声明
          </div>
          <Space height="10" />
          <div class="text-grayDefault leading-relaxed">
            本作品通过创世数藏区块链进行存证，Filecoin永久存储本证书作为该作品通行的原创声明，具备法律效力，侵权必究。
          </div>
          <Space height="91" />
          <div class="flex justify-center">
            <Qrcode
              :value="qrcodeVerifyAuth"
              :size="$pxToPxRatio(100)"
              :margin="$pxToPxRatio(2)"
            />
          </div>
          <Space height="8" />
          <div class="text-center">
            扫码验证藏品信息
          </div>
        </div>
        <van-image
          class="absolute right-2 bottom-48 z-2"
          :src="c2"
          :width="$pxToVw(178)"
          :height="$pxToVw(178)"
          fit="contain"
        />
      </div>
      <Space height="20" />
      <Icon
        type="icon-close_circle"
        size="28"
        @click="() => (numberSid = false)"
      />
      <Space height="47" />
    </div>
  </van-popup>
  <payPopup
    v-model:pay="pay"
    :pay-callback="payCallback"
    :detail="detail"
  />
</template>
<script setup>
import a5 from '@/assets/images/a5.png';
import { Toast, Dialog } from 'vant';
import {
  computed,
  getCurrentInstance, ref, watch
} from 'vue';
import { useRoute } from 'vue-router';
import { copyText } from 'vue3-clipboard';
import { useStore } from 'vuex';
import c1 from './images/c1.png';
import c2 from './images/c2.png';
import logoBorder from './images/c3.png';
import envConfig from '@/utils/env';
let store = useStore();
let route = useRoute();
let { proxy } = getCurrentInstance();

let sitePopover = ref(false);
let idPopover = ref(false);
let hashPopover = ref(false);

function copy(res) {
  copyText(res, undefined, (error, event) => {
    if (error) {
      console.error('复制失败');
    } else {
      Toast('复制成功');
    }
  });
}

let numberSid = ref(false);

let orderBuy = computed(() => {
  return route.query.origin === 'buy' && route.query.type === '待付款';
});
let orderSuccess = computed(() => {
  return route.query.origin === 'buy' && route.query.type === '已完成';
});
let orderCancel = computed(() => {
  return route.query.origin === 'buy' && route.query.type === '已取消';
});

let publishVerify = computed(() => {
  return route.query.origin === 'publish' && route.query.type === '审核中';
});
let publishPublish = computed(() => {
  return route.query.origin === 'publish' && route.query.type === '发布中';
});
let publishNomore = computed(() => {
  return route.query.origin === 'publish' && route.query.type === '已售罄';
});
let publishCancel = computed(() => {
  return route.query.origin === 'publish' && route.query.type === '已取消';
});
let publishReject = computed(() => {
  return route.query.origin === 'publish' && route.query.type === '被拒绝';
});
let publishLock = computed(() => {
  return route.query.origin === 'publish' && route.query.type === '被锁定';
});

function formatSite(site) {
  if (site) {
    return `${site.slice(0, 6)}...${site.slice(-6)}`;
  } else {
    return '无';
  }
}

let detail = ref({});
function getCollectionDetail() {
  proxy
    .$http(
      'post',
      `/v1/dc/dcDescrById?dcId=${route.query.id}`,
      {},
    )
    .then((res) => {
      res.data = {
        ...res.data,
        marketType: (() => {
          switch (res.data.marketType) {
            case 0:
              return '版权品';
            case 1:
              return '衍生品';
          }
        })(),
        sellType: (() => {
          switch (res.data.sellType) {
            case 0:
              return '定价';
            case 1:
              return '拍卖';
            case 2:
              return '盲盒';
          }
        })(),
        seriesType: (() => {
          switch (res.data.seriesType) {
            case 0:
              return '单品';
            case 1:
              return '系列';
          }
        })(),
        chainContract: (() => {
          switch (res.data.chainContract) {
            case 0:
              return 'ERC721';
            case 1:
              return 'ERC1155';
          }
        })(),
        payType: (() => {
          switch (res.data.payType) {
            case 0:
              return '余额';
            case 1:
              return '支付宝';
            case 2:
              return '微信';
            case 3:
              return '数字人民币';
          }
        })(),
        number: res.data.deriveStock,
      };
      detail.value = res.data;
    })
    .thenError((res) => Toast(res.msg));
}

function getOrderDetail() {
  proxy
    .$http(
      'post',
      `/v1/order/getById?orderId=${route.query.id}`,
      {},
    )
    .then((res) => {
      res.data = {
        ...res.data,
        marketType: (() => {
          switch (res.data.marketType) {
            case 0:
              return '版权品';
            case 1:
              return '衍生品';
          }
        })(),
        sellType: (() => {
          switch (res.data.sellType) {
            case 0:
              return '定价';
            case 1:
              return '拍卖';
            case 2:
              return '盲盒';
          }
        })(),
        seriesType: (() => {
          switch (res.data.seriesType) {
            case 0:
              return '单品';
            case 1:
              return '系列';
          }
        })(),
        chainContract: (() => {
          switch (res.data.chainContract) {
            case 0:
              return 'ERC721';
            case 1:
              return 'ERC1155';
          }
        })(),
        payType: (() => {
          switch (res.data.payType) {
            case 0:
              return '余额';
            case 1:
              return '支付宝';
            case 2:
              return '微信';
            case 3:
              return '数字人民币';
          }
        })(),
        number: res.data.buyCount,
      };
      detail.value = res.data;
    })
    .thenError((res) => Toast(res.msg));
}

function getDetail() {
  if (route.query.origin === 'buy') {
    getOrderDetail();
  }
  if (route.query.origin === 'publish') {
    getCollectionDetail();
  }
}
getDetail();

let pay = ref(false);
watch(pay, () => {
  if (!pay.value) {
    getDetail();
  }
});
function payCallback() {
  proxy.$router.replace(`/tabbar/user/order?type=已完成&id=${route.query.id}&origin=buy`);
  getDetail();
}
async function clickPaySubmit() {
  let userinfo = await store.dispatch('getUserinfo');
  if (!userinfo.isAuth) {
    Dialog.confirm({
      closeOnClickOverlay: true,
      message: '请先实名认证',
      theme: 'round-button',
    }).then(() => {
      proxy.$router.push('/tabbar/user/set/auth');
    }).catch(() => {});
    return;
  }
  if (!userinfo.isPayPassWord) {
    Dialog.confirm({
      closeOnClickOverlay: true,
      message: '请先设置交易密码',
      theme: 'round-button',
    }).then(() => {
      proxy.$router.push('/tabbar/user/set/payPassword');
    }).catch(() => {});
    return;
  }
  pay.value = true;
}

function clickTokenId() {
  let url = `${envConfig.tokenIdUrl}/${detail.value.contractAddress}?a=${detail.value.tokenId}`;
  if (window.plus) {
    plus.runtime.openURL(url);
  } else {
    window.open(url);
  }
}

function clickHash() {
  let url = detail.value.fileUrl;
  if (window.plus) {
    plus.runtime.openURL(url);
  } else {
    window.open(url);
  }
}

function downloadImage() {
  if (window.plus) {
    window.AppSaveImage(detail.value.certifyUrl);
  } else {
    let request = new XMLHttpRequest();
    request.responseType = 'blob';
    request.open('GET', detail.value.certifyUrl);
    request.onload = function () {
      let u = window.URL.createObjectURL(this.response);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.href = u;
      a.download = name;
      a.click();
      document.body.removeChild(a);
    };
    request.send();
  }
}

let qrcodeVerifyAuth = computed(() => {
  let origin = location.origin;
  return `${origin}/#/verifyAuth?certifyId=${detail.value.certifyId}`;
});

</script>
<style lang="less" scoped>
.showCard {
  position: relative;
  .showCardBg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 75%;
    height: 165px;
    transform: translateX(-50%);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    filter: blur(30px);
  }
  .lookNumberSid {
    position: absolute;
    right: 20px;
    bottom: 20px;
    background: linear-gradient(
      180deg,
      #ffd8bd 0%,
      #dbaa88 100%
    );
    box-shadow: 0px 3px 10px 0px rgba(242, 195, 162, 1);
    border-radius: 19px;
    padding: 7px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 400;
    color: #7a2a00;
    line-height: 18px;
  }
}
.fixedButton {
  position: fixed;
  bottom: 23px;
  left: 15px;
  width: 345px;
  height: 50px;
  background: #ffffff;
  box-shadow: 0px 5px 10px 0px rgba(222, 222, 222, 0.5),
    inset 0px 0px 7px 0px rgba(255, 249, 249, 1);
  border-radius: 25px;
  background: white url('@/assets/images/a6.png') no-repeat
    center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 44px 0 10px;
  color: white;
}
</style>
