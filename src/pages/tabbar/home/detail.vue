<template>
  <NavBar
    :go-back="true"
    title="藏品详情"
  >
    <!-- <template #right>
      <Icon
        type="icon-fenxiang"
        size="23"
        @click="() => sharePopup = true"
      />
    </template> -->
  </NavBar>
  <div class="pageCard-sm pb-24">
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
        class="lookNumberSid"
        @click="() => (numberSid = true)"
      >
        查看数字证书
      </div>
      <!-- <div class="number absolute right-5 top-5 text-white text-xs opacity-80 font-light">
        {{ detail.deriveStock }}
      </div> -->
    </div>
    <Space height="15" />
    <div class="flex items-center justify-between px-4">
      <div
        class="text-base font-semibold text-blackTitle max-w-bai3 truncate"
      >
        {{ detail.name }}
      </div>
      <div
        class="flex items-center"
        @click="switchLive"
      >
        <Icon
          :type="
            detail.isLike ? 'icon-dianzan' : 'icon-dianzan2'
          "
          size="15"
        />
        <Space width="10" />
        <div>{{ detail.likeNum }}</div>
      </div>
    </div>
    <Space height="15" />
    <div
      class="rounded-lg2 bg-white shadow-md shadow-gray-100 py-3 px-4 text-grayCard text-xs2 grid gap-y-1 gap-x-6 grid grid-rows-2 grid-cols-6 grid-flow-col-dense items-center"
      @click="goCreatorShow"
    >
      <van-image
        :width="parseInt($pxToPxRatio(45), 10)"
        :height="parseInt($pxToPxRatio(45), 10)"
        fit="cover"
        class="rounded-full overflow-hidden mr-2 row-span-2"
        :src="detail.artistHeadPic || '123'"
        :icon-size="parseInt($pxToPxRatio(45), 10)"
        :error-icon="a5"
      />
      <div class="max-w-bai2 truncate col-span-3 text-base">
        {{ detail.artistNickName || '---' }}
      </div>
      <div class="max-w-bai2 truncate col-span-3">
        {{ detail.artistDescr }}
      </div>
      <div
        v-if="!isSelf"
        class="keepButton row-span-2 justify-self-start ml-2 text-xs2 active:ring-2 ring-redTitle"
        :class="{ active: detail.isFollow }"
        @click="switchFollow"
      >
        {{ detail.isFollow ? '已关注' : '+关注' }}
      </div>
    </div>
    <Space height="15" />
    <div
      class="rounded-lg2 bg-white shadow-md shadow-gray-100 py-3 px-4 text-grayCard text-xs2 grid gap-3"
    >
      <div class="flex items-center justify-between">
        <span>市场类型</span>
        <span>{{ detail.marketType }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>数量</span>
        <span class=" text-orangeTip">x{{ detail.deriveStock }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>出售类型</span>
        <span>{{ detail.sellType }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>藏品类型</span>
        <span class="max-w-bai3 truncate">{{
          detail.seriesType
        }}</span>
      </div>
      <div
        v-if="detail.seriesType === '系列'"
        class="flex items-center justify-between"
      >
        <span>系列名称</span>
        <span class="max-w-bai3 truncate">{{
          detail.seriesName
        }}</span>
      </div>
    </div>
    <Space height="15" />
    <div
      class="text-base font-semibold px-4 text-blackTitle"
    >
      认证信息
    </div>
    <Space height="10" />
    <div
      class="rounded-lg2 bg-white shadow-md shadow-gray-100 py-3 px-4 text-grayCard text-xs2 grid gap-3"
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
          <span @click="clickTokenId">{{
            formatSite(detail.tokenId)
          }}</span>
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
            永久存储商鼎云的唯一哈希
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
    </div>
    <Space height="20" />
    <div
      class="text-base font-semibold px-4 text-blackTitle"
    >
      购买须知
    </div>
    <Space height="11" />
    <div
      class="rounded-lg2 bg-white shadow-md shadow-gray-100 py-3 px-4 text-grayCard text-xs2 leading-normal"
    >
      <div class="">
        数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18岁的中国大陆用户购买。
      </div>
      <div class="">
        数字藏品的版权由原创者或发行方所有，用户不得将数字藏品用于任何商业用途，包括但不限于出售数字藏品的副本、使用权、衍生作品。数字藏品一经售出，不支持退换。
      </div>
      <div class="">
        请勿对数字藏品进行炒作、欺诈，或以任何其他非法方式进行使用。
      </div>
    </div>
    <Space height="20" />
    <div
      class="text-base font-semibold px-4 text-blackTitle"
    >
      藏品详情
    </div>
    <Space height="11" />
    <div
      class="detailContent text-xs2 text-grayTip leading-5 px-3 tracking-wider text-justify"
    >
      {{ detail.descr }}
    </div>
    <Space height="15" />
    <van-image
      v-for="item of detail.imgDescr?.split(',')"
      :key="item"
      class="w-full"
      fit="contain"
      :src="item"
    />
    <div
      v-if="collect"
      class="fixedBottomButton"
      @click="clickSellSubmit"
    >
      <van-button
        type="danger"
        block
        round
      >
        出售
      </van-button>
    </div>
    <div
      v-else
      class="fixedButton"
      :class="
        sell
          ? ''
          : !(
            detail.status === 4 &&
            detail.deriveStock &&
            !sell
          )
            ? 'gray grayscale'
            : ''
      "
    >
      <span class="price truncate w-48 text-center px-2">¥ {{ $formatPrice(detail.price, 2, true) }}</span>
      <span
        v-if="sell"
        class="flex-auto text-right pr-12 py-2"
        @click="clickSubmit"
      >下架</span>
      <template v-else>
        <span
          v-if="!detail.deriveStock"
          class="flex-auto text-right pr-12 py-2"
          :class="{ 'text-grayDefault': !detail.deriveStock }"
        >已售罄</span>
      </template>
      <span
        v-if="detail.status === 5"
        class="flex-auto text-right pr-12 py-2"
      >已下架</span>
      <span
        v-if="detail.status === 6"
        class="flex-auto text-right pr-12 py-2"
      >已锁定</span>
      <span
        v-if="
          detail.status === 4 && detail.deriveStock && !sell
        "
        class="flex-auto text-right pr-12 py-2"
        @click="clickSubmit"
      >购买</span>
    </div>
  </div>
  <van-popup
    v-model:show="numberSid"
    :close-on-click-overlay="false"
    class="w-full transparent py-10"
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
                {{ formatSite(detail.tokenId) }}
              </span>
            </div>
            <div class="flex item-center justify-between">
              <span>永久存储哈希</span>
              <span
                class="flex items-center text-orangeTitle"
              >
                {{ formatSite(detail.hash) }}
              </span>
            </div>
            <div class="flex item-center justify-between">
              <span>藏品平台</span>
              <span>河图数藏</span>
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
            本作品通过河图数藏区块链进行存证，商鼎云分布式永文存储本证书作为该作品通行的原创声明，具备法律效力，侵权必究。
          </div>
          <Space height="91" />
          <div class="flex justify-center">
            <Qrcode
              :value="qrcodeVerifyAuth"
              :size="$pxToPxRatio(100)"
              :margin="$pxToPxRatio(4)"
            />
          </div>
          <Space height="8" />
          <div class="text-center">
            扫码验证藏品信息
          </div>
        </div>
        <van-image
          class="absolute right-0 bottom-52 z-2"
          :src="c2"
          :width="$pxToVw(152)"
          :height="$pxToVw(152)"
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
  <van-popup
    v-model:show="sharePopup"
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
        <!-- <div class="download absolute right-4 top-4 z-1 bg-black/40 w-9 h-9 rounded-full flex items-center justify-center">
          <Icon
            type="icon-download"
            size="20"
          />
        </div> -->
        <van-image
          class
          :width="$pxToVw(256)"
          :height="$pxToVw(254)"
          :src="detail.fileUrl"
          fit="cover"
        />
      </div>
      <div class="cardContent w-full -mt-48 relative">
        <van-image
          class
          :src="c5"
          fit="cover"
        />
        <div
          class="absolute top-0 left-0 z-1 px-5 text-grayCard w-full h-full text-xs2"
        >
          <Space height="204" />
          <div class="flex justify-between px-6">
            <div
              class="flex flex-col justify-center text-sm text-blackTitle font-semibold"
            >
              <div class="max-w-bai2 truncate">
                藏品：{{ detail.name }}
              </div>
              <Space height="20" />
              <div class="max-w-bai2 truncate">
                艺术家：{{ detail.artistNickName }}
              </div>
            </div>
            <div class="flex justify-center">
              <Qrcode
                :value="detail.certifyUrl"
                :size="$pxToPxRatio(85)"
                :margin="$pxToPxRatio(1)"
              />
            </div>
          </div>
          <Space height="67" />
          <div class="flex justify-around text-sm">
            <div
              class="flex flex-col items-center"
              @click="() => share('weixin')"
            >
              <Icon
                type="icon-weixin"
                size="40"
              />
              <Space height="8" />
              <div>微信好友</div>
            </div>
            <div
              class="flex flex-col items-center"
              @click="() => share('pengyouquan')"
            >
              <Icon
                type="icon-pengyouquan"
                size="40"
              />
              <Space height="8" />
              <div>朋友圈</div>
            </div>
            <div
              class="flex flex-col items-center"
              @click="() => share('weibo')"
            >
              <Icon
                type="icon-weibo"
                size="40"
              />
              <Space height="8" />
              <div>微博</div>
            </div>
          </div>
        </div>
      </div>
      <Space height="20" />
      <Icon
        type="icon-close_circle"
        size="28"
        @click="() => (sharePopup = false)"
      />
      <Space height="47" />
    </div>
  </van-popup>
  <payPopup
    v-model:pay="pay"
    :pay-callback="payCallback"
    :detail="detail"
  />
  <van-popup
    v-model:show="sellPopup"
    :close-on-click-overlay="false"
    class="transparent"
  >
    <div class="px-9 card w-80 text-blackDefault">
      <Space height="37" />
      <div class="text-base font-semibold text-center">
        确定下架
      </div>
      <Space height="20" />
      <div class="text-sm text-grayTip text-center">
        您确定下架这款藏品吗？
      </div>
      <Space height="35" />
      <div class="relative ring-1 rounded-3xl ring-redLine">
        <van-image
          class="w-full"
          :height="parseInt($pxToPxRatio(40), 10)"
          fit="fill"
          :src="a2"
        />
        <div
          class="flex items-center justify-between absolute left-0 top-0 z-1 w-full h-full text-xs2"
        >
          <div
            class="flex-auto flex justify-center text-redLine"
            @click="() => (sellPopup = false)"
          >
            取消
          </div>
          <div
            class="flex-auto flex justify-center text-white"
            @click="sellDownPopupSubmit"
          >
            确定
          </div>
        </div>
      </div>
      <Space height="30" />
    </div>
  </van-popup>
  <van-popup
    v-model:show="sellPasswordPopup"
    position="bottom"
    :round="true"
    :style="{
      // height: $pxToVw(sellPasswordPopupNext ? 515 : 288),
      height: $pxToVw(sellPasswordPopupNext ? 'auto' : 288),
    }"
  >
    <!-- <Icon
      v-if="sellPasswordPopupNext"
      class="absolute left-4 top-7 z-1"
      type="icon-fanhui"
      size="23"
      @click="() => (sellPasswordPopupNext = false)"
    /> -->
    <Icon
      class="absolute right-10 top-7 z-1"
      type="icon-guanbi"
      size="23"
      @click="() => (sellPasswordPopup = false)"
    />
    <Space height="34" />
    <div class="px-6">
      <Space height="33" />
      <!-- <template v-if="!sellPasswordPopupNext">
        <div class="text-sm">
          交易密码
        </div>
        <Space height="10" />
        <div class="border rounded-md px-3">
          <van-field
            v-model="payPassword"
            size="normal"
            type="password"
            placeholder="请输入您的交易密码"
            class="text-sm"
          />
        </div>
        <Space height="10" />
        <div class="text-right text-xs2 text-grayDefault">
          忘记交易密码？
        </div>
        <Space height="39" />
        <van-button
          type="danger"
          block
          round
          @click="sellPasswordPopupNextSubmit"
        >
          {{
            sellPasswordPopupNext ? '确认支付' : '下一步'
          }}
        </van-button>
      </template> -->
      <!-- <template v-else> -->
      <div
        v-if="sellParams.orderMoney > 0"
        class="text-sm flex items-center"
      >
        购买价格
        <Space width="31" />
        <div class="text-lg text-redTitle font-semibold">
          ¥
          {{ $formatPrice(sellParams.orderMoney, 2, true) }}
        </div>
      </div>
      <Space height="20" />
      <div class="text-sm">
        出售类型:
      </div>
      <Space height="10" />
      <div class="inputCard flex items-center">
        <van-field
          v-model="sellType"
          type="text"
          size="small"
          readonly
          placeholder="请选择出售类型"
          class="text-grayDefault"
        />
        <!-- @click="() => (sellTypePopup = true)" -->
        <!-- <van-icon
          name="arrow-down"
          class="text-grayDefault"
        /> -->
      </div>
      <Space height="20" />
      <div class="text-sm">
        价格
      </div>
      <Space height="10" />
      <div class="border rounded-md px-3">
        <van-field
          v-model="sellPrice"
          size="normal"
          type="number"
          placeholder="请输入您藏品的出售价格"
          class="text-sm"
        />
      </div>
      <Space height="6" />
      <div
        class="text-xs text-blueDefault flex items-center pl-1"
      >
        <div>版权费：{{ sellParams.copyrightFee }}%</div>
        <div
          v-if="sellParams.buy"
          class="ml-3"
        >
          寄售手续费：{{ sellParams.serviceFee }}%
        </div>
        <div
          v-else
          class="ml-3"
        >
          平台分佣：{{ sellParams.commission }}%
        </div>
      </div>
      <Space height="20" />
      <div class="text-sm">
        下架时间
      </div>
      <Space height="10" />
      <div class="border rounded-md px-3 flex items-center">
        <van-field
          v-model="showTime"
          readonly
          size="normal"
          type="text"
          placeholder="藏品下架时间不少于12个小时"
          class="text-sm"
          @click="() => (selectTime = true)"
        />
        <Icon
          type="icon-rili"
          size="16"
        />
      </div>
      <Space height="30" />
      <div class="text-sm">
        交易密码
      </div>
      <Space height="10" />
      <div class="border rounded-md px-3">
        <van-field
          v-model="payPassword"
          size="normal"
          type="password"
          placeholder="请输入您的交易密码"
          class="text-sm"
        />
      </div>
      <Space height="10" />
      <div
        class="text-right text-xs2 text-grayDefault"
        @click="
          () => $router.push('/tabbar/user/set/payPassword')
        "
      >
        忘记交易密码？
      </div>
      <Space height="39" />
      <div class="text-center text-xs text-blueDefault">
        预计此次出售实际可得：¥
        {{ $formatPrice(sellGetPriceProgress, 2, true) }}
      </div>
      <Space height="13" />
      <van-button
        type="danger"
        round
        block
        @click="sellOutPopupSubmit"
      >
        提交
      </van-button>
      <Space height="30" />
      <!-- </template> -->
    </div>
  </van-popup>
  <van-popup
    v-model:show="sellTypePopup"
    round
    position="bottom"
  >
    <van-picker
      :columns="sellTypecColumns"
      @cancel="sellTypePopup = false"
      @confirm="onConfirmSellType"
    />
  </van-popup>
  <van-popup
    v-model:show="selectTime"
    round
    position="bottom"
  >
    <van-datetime-picker
      v-model="currentDate"
      type="datetime"
      title="选择下架时间"
      :min-date="minDate"
      :formatter="formatter"
      @confirm="onConfirmSelectTime"
      @cancel="() => (selectTime = false)"
    />
  </van-popup>
</template>
<script setup>
import a2 from '@/assets/images/a2.png';
import a5 from '@/assets/images/a5.png';
import dayjs from 'dayjs';
import { Toast, Dialog } from 'vant';
import {
  computed,
  getCurrentInstance,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { copyText } from 'vue3-clipboard';
import { useStore } from 'vuex';
import logoBorder from './images/c3.png';
import c5 from './images/c5.png';
import c1 from './images/c1.png';
import c2 from './images/c2.png';
import envConfig from '@/utils/env';
import router from '../../../router';

let store = useStore();
let route = useRoute();
let { proxy } = getCurrentInstance();

let minDate = ref(new Date(dayjs().add(13, 'hour')));
const formatter = (type, val) => {
  if (type === 'year') {
    return `${val}年`;
  }
  if (type === 'month') {
    return `${val}月`;
  }
  if (type === 'day') {
    return `${val}日`;
  }
  if (type === 'hour') {
    return `${val}时`;
  }
  if (type === 'minute') {
    return `${val}分`;
  }
  return val;
};

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

let sharePopup = ref(false);

let pay = ref(false);
watch(pay, () => {
  if (!pay.value) {
    getDetail();
  }
});
function payCallback() {
  proxy.$router.replace('/tabbar/user/buy');
}

let sell = computed(() => {
  return route.query.type === 'sell';
});
let collect = computed(() => {
  return route.query.type === 'collect';
});
let sellPopup = ref(false);
function sellDownPopupSubmit() {
  proxy
    .$http(
      'post',
      `/v1/dc/cancel?dcId=${route.query.id}`,
      {},
    )
    .then((res) => {
      sellPopup.value = false;
      proxy.$router.back();
      getDetailProgress();
    })
    .thenError((res) => Toast(res.msg));
}
async function clickSubmit() {
  let userinfo = await store.dispatch('getUserinfo');
  if (!userinfo.isAuth) {
    Dialog.confirm({
      closeOnClickOverlay: true,
      message: '请先实名认证',
      theme: 'round-button',
    })
      .then(() => {
        proxy.$router.push('/tabbar/user/set/auth');
      })
      .catch(() => {});
    return;
  }
  if (sell.value) {
    // 下架
    sellPopup.value = true;
    return;
  }
  pay.value = true;
}
let sellPasswordPopup = ref(false);
let sellPasswordPopupNext = ref(true);
let sellType = ref('定价');
let sellTypePopup = ref(false);
const sellTypecColumns = ['定价'];
let sellPrice = ref('');
let sellParams = ref({});
let payPassword = ref('');
let sellGetPriceProgress = computed(() => {
  let rate = 0;
  if (sellParams.value.buy) {
    rate =
      sellParams.value.copyrightFee +
      sellParams.value.serviceFee;
  } else {
    rate =
      sellParams.value.copyrightFee +
      sellParams.value.commission;
  }
  return ((sellPrice.value * (detail.value.deriveStock || 1)) * (100 - rate)) / 100;
});
function sellOutPopupSubmit() {
  if (sellPrice.value < 0) {
    Toast('价格不能小于0');
    return false;
  }
  if (sellPrice.value > 999999999) {
    Toast('价格不能大于999999999');
    return false;
  }
  proxy
    .$http('post', '/v1/dc/sell', {
      dcId: route.query.id,
      overTime: dayjs(showTime.value).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      payPassWord: payPassword.value,
      price: sellPrice.value,
    })
    .then((res) => {
      Toast('上架成功');
      sellPasswordPopup.value = false;
      proxy.$router.replace('/tabbar/user/publish?type=4');
      getDetailProgress();
    })
    .thenError((res) => Toast(res.msg));
}
function clickSellSubmit() {
  sellPasswordPopup.value = true;
  proxy
    .$http(
      'post',
      `/v1/dc/sellConfig?dcId=${route.query.id}`,
      {},
    )
    .then((res) => {
      sellParams.value = res.data;
    })
    .thenError((res) => Toast(res.msg));
  // sellPasswordPopupNext.value = false;
}
// function sellPasswordPopupNextSubmit() {
//   if (!sellPasswordPopupNext.value) {
//     sellPasswordPopupNext.value = true;
//   } else {
//   }
// }
const onConfirmSellType = (value) => {
  sellType.value = value;
  sellTypePopup.value = false;
};

let selectTime = ref(false);
const currentDate = ref(new Date());
let showTime = ref('');
function onConfirmSelectTime() {
  selectTime.value = false;
  showTime.value = dayjs(currentDate.value).format(
    'YYYY-MM-DD HH:mm:ss',
  );
}

function formatSite(site) {
  if (site) {
    if (site.length > 12) {
      return `${site.slice(0, 6)}...${site.slice(-6)}`;
    } else {
      return site;
    }
  } else {
    return '无';
  }
}
let detail = ref({});
function getDetail() {
  proxy
    .$http(
      'post',
      `/v1/dc/dcById?dcId=${route.query.id}`,
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
              return '支付';
            case 2:
              return '微信';
            case 3:
              return '数字人民币';
          }
        })(),
      };
      detail.value = res.data;
    })
    .thenError((res) => Toast(res.msg));
}
function getSelfDetail() {
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
              return '支付';
            case 2:
              return '微信';
            case 3:
              return '数字人民币';
          }
        })(),
      };
      detail.value = res.data;
    })
    .thenError((res) => Toast(res.msg));
}
function getDetailProgress() {
  if (route.query.type === 'collect') {
    getSelfDetail();
  } else {
    getDetail();
  }
}
getDetailProgress();

let switchLive = proxy.$debounce(() => {
  let switchType = detail.value.isLike ? 2 : 1;
  proxy
    .$http('post', '/v1/friend/userLike', {
      dcId: route.query.id,
      likeType: 0,
      type: switchType,
    })
    .then((res) => {
      detail.value.isLike = !detail.value.isLike;
      if (switchType === 1) {
        detail.value.likeNum++;
      } else {
        detail.value.likeNum--;
      }
    })
    .thenError((err) => {
      Toast(err.msg);
    });
});

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

let isSelf = computed(() => {
  return (
    +detail.value.artistUserId === store.state.userinfo?.id
  );
});

let switchFollow = proxy.$debounce((e) => {
  e.stopPropagation();
  proxy
    .$http('post', '/v1/friend/operation', {
      type: detail.value.isFollow ? 2 : 1,
      userId: detail.value.artistUserId,
    })
    .then((res) => {
      if (!detail.value.isFollow) {
        Toast('关注成功');
      } else {
        Toast('已取消关注');
      }
      detail.value.isFollow = !detail.value.isFollow;
    })
    .thenError((err) => {
      Toast(err.msg);
    });
}, 300);

function goCreatorShow() {
  proxy.$router.push(
    `/tabbar/user/creator/show?id=${detail.value.artistUserId}`,
  );
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
  left: 25px;
  width: 325px;
  height: 50px;
  background: #ffffff;
  box-shadow: 0px 5px 10px 0px rgba(255, 211, 211, 0.5),
    inset 0px 1px 7px 0px rgba(255, 249, 249, 1);
  border-radius: 25px;
  background: white url('@/assets/images/a1.png') no-repeat
    center right;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  &.gray {
    background: white url('@/assets/images/a7.png')
      no-repeat center right;
    background-size: cover;
    color: #999999;
    .price {
      color: #999999;
    }
  }
  .price {
    font-size: 18px;
    font-weight: bold;
    color: #e0260e;
    line-height: 23px;
    letter-spacing: 1px;
  }
}

.keepButton {
  background: #ffe5e5;
  border-radius: 18px;
  width: 85px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e0260e;
  &.active {
    background: #ef4034;
    color: white;
  }
}
</style>
