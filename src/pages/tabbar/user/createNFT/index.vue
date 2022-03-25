<template>
  <NavBar title="铸造NFT" />
  <div class="relative z-1 flex-auto">
    <van-image
      class="w-full h-full absolute top-0 left-0 -z-1"
      :height="parseInt($pxToPxRatio(1034), 10)"
      fit="cover-top"
      :src="bg1"
    />
    <van-image
      class="w-full h-full fixed top-0 left-0 -z-2"
      :height="parseInt($pxToPxRatio(1134), 10)"
      fit="cover-bottom"
      :src="bg1"
    />
    <div class="pageCard-sm">
      <Space height="176" />
      <div class="card px-5 text-sm">
        <Space height="20" />
        <div class="flex items-center">
          <div class="w-1/4">
            类型
          </div>
          <div class="px-3 flex-auto flex">
            <van-radio-group
              v-model="series"
              class="flex items-center"
            >
              <van-radio
                :name="1"
                class="w-24"
              >
                单品
                <template #icon="props">
                  <img
                    class="img-icon w-3.5 h-3.5"
                    :src="props.checked ? d1 : d2"
                  >
                </template>
              </van-radio>
              <van-radio
                :name="2"
                class="w-24"
              >
                系列
                <template #icon="props">
                  <img
                    class="img-icon w-3.5 h-3.5"
                    :src="props.checked ? d1 : d2"
                  >
                </template>
              </van-radio>
            </van-radio-group>
          </div>
        </div>
        <Space height="15" />
        <template v-if="series === 2">
          <div class="flex items-center">
            <div class="w-1/4">
              系列名称
            </div>
            <div
              class="border rounded-md px-3 flex-auto flex items-center"
            >
              <van-field
                v-model="seriesName"
                readonly
                size="normal"
                type="text"
                placeholder="请选择系列名称"
                class="text-sm"
                @click="showSelectSeries"
              />
              <div
                class="flex-shrink-0 text-blueDefault text-xs"
                @click="() => (addSeriesShow = true)"
              >
                新增系列
              </div>
            </div>
          </div>
          <Space height="15" />
        </template>
        <div class="flex items-center">
          <div class="w-1/4">
            名称
          </div>
          <div class="border rounded-md px-3 flex-auto">
            <van-field
              v-model="name"
              size="normal"
              type="text"
              placeholder="请为您的NFT命名"
              class="text-sm"
            />
          </div>
        </div>
        <Space height="15" />
        <div class="flex items-center">
          <div class="w-1/4">
            源文件
          </div>
          <van-uploader :after-read="uploadAfter">
            <div
              class="border rounded-md w-28 px-3 py-2 text-sm text-grayTip text-center"
            >
              上传
            </div>
          </van-uploader>
        </div>
        <div
          v-if="upload"
          class="pl-16"
        >
          <div class="pl-3">
            <div
              class="flex items-center justify-between rounded-md bg-[#F9F9F9] pl-5 pr-2 py-2 mt-2.5"
            >
              <div class="w-48 truncate">
                {{ upload }}
              </div>
            </div>
          </div>
        </div>
        <Space height="20" />
        <div class="flex items-center">
          <div class="w-1/4">
            出售方式
          </div>
          <div class="px-3 flex-auto flex">
            <van-radio-group
              v-model="sellType"
              class="flex items-center"
            >
              <van-radio
                :name="1"
                class="w-24"
              >
                定价
                <template #icon="props">
                  <img
                    class="img-icon w-3.5 h-3.5"
                    :src="props.checked ? d1 : d2"
                  >
                </template>
              </van-radio>
              <!-- <van-radio
                :name="2"
                class=" w-24"
              >
                拍卖
                <template #icon="props">
                  <img
                    class="img-icon w-3.5 h-3.5"
                    :src="props.checked ? d1 : d2"
                  >
                </template>
              </van-radio> -->
            </van-radio-group>
          </div>
        </div>
        <Space height="20" />
        <div class="flex items-center">
          <div class="w-1/4">
            价格
          </div>
          <div class="border rounded-md px-3 flex-auto">
            <van-field
              v-model="price"
              size="normal"
              type="text"
              placeholder="请输入您藏品的出售价格"
              class="text-sm"
            />
          </div>
        </div>
        <Space height="12" />
        <div class="text-xs text-blueDefault text-right">
          预计实际可得：￥
          {{
            $toFixed((price / 100) * (100 - rate), 2, true)
          }}
          <span class=" ml-2">平台分佣：{{ rate }}%</span>
        </div>
        <Space height="20" />
        <div class="flex items-center">
          <div class="w-1/4">
            权益属性
          </div>
          <div class="px-3 flex-auto flex">
            <van-radio-group
              v-model="property"
              class="flex items-center"
            >
              <van-radio
                v-for="item in attrConfigList"
                :key="item"
                :name="item.id"
                class="w-24"
              >
                {{ item.name }}
                <template #icon="props">
                  <img
                    class="img-icon w-3.5 h-3.5"
                    :src="props.checked ? d1 : d2"
                  >
                </template>
              </van-radio>
            </van-radio-group>
          </div>
        </div>
        <Space height="20" />
        <div class="flex items-center">
          <div class="w-1/4">
            公链类型
          </div>
          <div class="px-3 flex-auto flex">
            <van-radio-group
              v-model="chainType"
              class="flex items-center"
              disabled
            >
              <van-radio
                v-for="item in attrConfigList"
                :key="item"
                :name="item.standard"
                class="w-24"
              >
                {{ item.standard }}
                <template #icon="props">
                  <img
                    class="img-icon w-3.5 h-3.5"
                    :src="props.checked ? d1 : d2"
                  >
                </template>
              </van-radio>
            </van-radio-group>
          </div>
        </div>
        <Space height="20" />
        <template v-if="property === 2">
          <div class="flex items-center">
            <div class="w-1/4">
              数量
            </div>
            <div class="border rounded-md px-3 flex-auto">
              <van-field
                v-model="number"
                size="normal"
                type="digit"
                placeholder="请输入衍生品数量"
                class="text-sm"
              />
            </div>
          </div>
          <Space height="20" />
        </template>
        <div class="flex items-center">
          <div class="w-1/4">
            存储类型
          </div>
          <div class="px-3 flex-auto flex">
            <van-radio-group
              v-model="storeType"
              class="flex items-center"
            >
              <van-radio :name="1">
                商鼎云分布式存储
                <template #icon="props">
                  <img
                    class="img-icon w-3.5 h-3.5"
                    :src="props.checked ? d1 : d2"
                  >
                </template>
              </van-radio>
            </van-radio-group>
          </div>
        </div>
        <Space height="20" />
        <div class="flex items-center mb-5">
          <div class="w-1/4">
            下架时间
          </div>
          <div
            class="border rounded-md flex-auto px-3 flex items-center"
          >
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
        </div>
        <div class="flex items-start mb-5">
          <div class="w-1/4">
            藏品介绍
          </div>
          <div class="border rounded-md px-3 flex-auto">
            <van-field
              v-model="intro"
              type="textarea"
              :autosize="{ minHeight: 80 }"
              placeholder="请输入您NFT介绍"
              show-word-limit
              maxlength="200"
            />
          </div>
        </div>
        <div class="flex items-center">
          <div class="w-1/4">
            藏品故事
          </div>
          <van-uploader
            :after-read="plotUploadAfter"
            :disabled="plotUploadList.length >= 3"
          >
            <div
              class="border rounded-md px-3 py-2 text-sm text-grayTip w-28 text-center"
            >
              上传（{{ plotUploadList.length }}/3）
            </div>
          </van-uploader>
          <div class="ml-1 text-xs text-grayTip">
            建议宽度为 750px
          </div>
        </div>

        <div
          v-if="plotUploadList.length"
          class=""
        >
          <div
            v-for="(item, index) of plotUploadList"
            :key="item"
          >
            <div
              class="flex items-center justify-between rounded-md bg-[#F9F9F9] pl-5 pr-2 py-2 mt-3 shadow-md mb-1"
            >
              <div class="w-48 truncate">
                {{ item.name }}
              </div>
              <Icon
                type="icon-sousuo-guanbi"
                size="17"
                @click="() => removePlotUploadList(index)"
              />
            </div>
            <van-image
              :width="parseInt($pxToPxRatio(309), 10)"
              :height="parseInt($pxToPxRatio(309), 10)"
              fit="cover"
              :src="item.url"
            />
          </div>
        </div>
        <Space height="41" />
        <div class="flex items-center justify-center">
          <van-checkbox
            v-model="checked"
            class="h-min"
          >
            <template #icon="props">
              <img
                class="img-icon w-3.5 h-3.5"
                :src="props.checked ? d1 : d2"
              >
            </template>
          </van-checkbox>
          <Space width="4" />
          <div class="text-xs2 text-grayDefault">
            我已阅读并同意<span class="text-blueDefault">《数字藏品铸造协议》</span>
          </div>
        </div>
        <Space height="15" />
        <van-button
          type="danger"
          round
          block
          :disabled="submitDisbled"
          :loading="loading"
          @click="submitBefore"
        >
          提交审核
        </van-button>
        <Space height="38" />
      </div>
      <Space height="30" />
    </div>
  </div>
  <van-popup
    v-model:show="successPopup"
    :close-on-click-overlay="false"
    class="transparent overflow-visible"
  >
    <div
      class="px-8 bg-white rounded-lg2 w-80 text-blackDefault flex flex-col items-center"
    >
      <Space height="23" />
      <van-image
        :width="parseInt($pxToPxRatio(162), 10)"
        :height="parseInt($pxToPxRatio(160), 10)"
        fit="cover"
        :src="b1"
      />
      <Space height="40" />
      <div class="text-base font-semibold text-center">
        提交成功
      </div>
      <Space height="20" />
      <div class="text-sm text-grayTip text-center">
        藏品上链需支付一定手续费暂由平台支付
      </div>
      <Space height="30" />
      <Icon
        class="absolute z-1 left-1/2 -bottom-4 transform -translate-x-1/2 translate-y-full"
        type="icon-close_circle"
        size="26"
        @click="() => $router.back()"
      />
    </div>
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
  <van-popup
    v-model:show="addSeriesShow"
    :close-on-click-overlay="false"
    class="transparent"
  >
    <div class="px-9 card w-80 text-blackDefault">
      <Space height="37" />
      <div class="text-base font-semibold text-center">
        新增系列名称
      </div>
      <Space height="37" />
      <div class="text-sm">
        系列名称
      </div>
      <Space height="10" />
      <div class="inputCard">
        <van-field
          v-model="addSeriesName"
          type="text"
          size="small"
          placeholder="请输入您的系列名称"
        />
      </div>
      <Space height="40" />
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
            @click="() => (addSeriesShow = false)"
          >
            取消
          </div>
          <div
            class="flex-auto flex justify-center text-white"
            @click="addSeriesSubmit"
          >
            确定
          </div>
        </div>
      </div>
      <Space height="30" />
    </div>
  </van-popup>
  <van-popup
    v-model:show="selectSeries"
    round
    position="bottom"
  >
    <van-picker
      title="标题"
      :columns="seriesList.map((item) => item.name)"
      :default-index="
        seriesList.findIndex(
          (item) => item.name === seriesName,
        )
      "
      @confirm="selectSeriesConfirm"
      @cancel="() => (selectSeries = false)"
    />
  </van-popup>
  <van-popup
    v-model:show="confirmSubmitPopup"
    :close-on-click-overlay="false"
    class="transparent"
  >
    <div class="px-9 card w-80 text-blackDefault">
      <Space height="37" />
      <div class="text-base font-semibold text-center">
        确认信息
      </div>
      <Space height="20" />
      <div class="text-sm text-blackDefault mb-2.5">
        名称
      </div>
      <div class="text-sm text-blackDefault mb-3.5 px-2.5 py-2 bg-grayBg rounded-md">
        {{ name }}
      </div>
      <div class="text-sm text-blackDefault mb-2.5">
        出售方式
      </div>
      <div class="text-sm text-blackDefault mb-3.5 px-2.5 py-2 bg-grayBg rounded-md">
        定价
      </div>
      <div class="text-sm text-blackDefault mb-2.5">
        价格
      </div>
      <div class="text-sm text-blackDefault mb-3.5 px-2.5 py-2 bg-grayBg rounded-md">
        {{ price }}
      </div>
      <div class="text-sm text-blackDefault mb-2.5">
        权益属性
      </div>
      <div class="text-sm text-blackDefault mb-3.5 px-2.5 py-2 bg-grayBg rounded-md">
        {{ attrConfigList.find(item => item.id === property).name }}
      </div>
      <template v-if="number">
        <div class="text-sm text-blackDefault mb-2.5">
          数量
        </div>
        <div class="text-sm text-blackDefault mb-3.5 px-2.5 py-2 bg-grayBg rounded-md">
          {{ number }}
        </div>
      </template>
      <Space height="43" />
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
            @click="() => (confirmSubmitPopup = false)"
          >
            取消
          </div>
          <div
            class="flex-auto flex justify-center text-white"
            @click="submit"
          >
            确定
          </div>
        </div>
      </div>
      <Space height="10" />
      <div class="text-xs text-blueDefault text-center text-[#4A79FF]">
        预计实际可得：￥
        {{
          $toFixed(((price * number) / 100) * (100 - rate), 2, true)
        }}
        <span class=" ml-2">平台分佣：{{ rate }}%</span>
      </div>
      <Space height="30" />
    </div>
  </van-popup>
</template>
<script setup>
import a2 from '@/assets/images/a2.png';
import bg1 from './images/bg1.png';
import d1 from '@/assets/images/d1.png';
import d2 from '@/assets/images/d2.png';
import b1 from './images/b1.png';
import {
  ref,
  watchEffect,
  getCurrentInstance,
  watch,
  computed,
} from 'vue';
import { Toast } from 'vant';
import dayjs from 'dayjs';

let { proxy } = getCurrentInstance();

const checked = ref(false);
let addSeriesShow = ref(false);
let addSeriesName = ref('');
let series = ref(1);
let name = ref('');
let seriesName = ref('');
let seriesList = ref([]);
let seriesId = ref('');
let selectSeries = ref(false);
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

let addSeriesSubmit = proxy.$debounce(() => {
  proxy
    .$http('get', '/v1/dc/seriesAdd', {
      name: addSeriesName.value,
    })
    .then((res) => {
      Toast.success('添加成功');
      addSeriesShow.value = false;
      getSeriesList();
    })
    .thenError((res) => {
      Toast(res.msg);
    });
});
function getSeriesList() {
  proxy
    .$http('post', '/v1/dc/seriesList', {})
    .then((res) => {
      seriesList.value = res.data;
      if (!seriesName.value || !seriesId.value) {
        seriesName.value = res.data[0].name;
        seriesId.value = res.data[0].id;
      }
    });
}
getSeriesList();
function selectSeriesConfirm(value, index) {
  seriesName.value = value;
  seriesId.value = seriesList.value[index].id;
  selectSeries.value = false;
}

let sellType = ref(1);
let price = ref('');
let property = ref(1);
let chainType = ref('');
let storeType = ref(1);
let showTime = ref('');
let intro = ref('');
let upload = ref();
let number = ref();

function uploadAfter(file) {
  proxy
    .$http('file', '/v1/cdn/uploadImgIpfs', {
      file: file.file,
    })
    .then((res) => {
      upload.value = res.data;
    });
}

let plotUploadList = ref([]);
function plotUploadAfter(file) {
  proxy
    .$http('file', '/v1/cdn/uploadImg', {
      file: file.file,
    })
    .then((res) => {
      plotUploadList.value.push({
        url: res.data,
        name: file.file.name,
      });
    });
}

function removePlotUploadList(index) {
  plotUploadList.value.splice(index, 1);
}

let attrConfigList = ref([]);
function getConfig() {
  proxy
    .$http('post', '/v1/dc/cfgParamList', {})
    .then((res) => {
      attrConfigList.value = res.data;
      property.value = res.data[0].id;
      chainType.value = res.data[0].standard;
    });
}
getConfig();
watchEffect(() => {
  let findIndex = attrConfigList.value.findIndex(
    (item) => item.id === property.value,
  );
  if (findIndex !== -1) {
    chainType.value =
      attrConfigList.value[findIndex].standard;
  }
});

let successPopup = ref(false);

let selectTime = ref(false);
const currentDate = ref(new Date());
function onConfirmSelectTime() {
  selectTime.value = false;
  showTime.value = dayjs(currentDate.value).format(
    'YYYY-MM-DD HH:mm:ss',
  );
}

let submitDisbled = computed(() => {
  if (
    !(
      name.value &&
      upload.value &&
      price.value &&
      showTime.value &&
      intro.value &&
      checked.value &&
      plotUploadList.value.length > 0
    )
  ) {
    return true;
  }
  if (property.value === 2) {
    if (!number.value) {
      return true;
    }
  }
  return false;
});

let confirmSubmitPopup = ref(false);
function submitBefore() {
  confirmSubmitPopup.value = true;
}

let loading = ref(false);
let submit = proxy.$debounce(() => {
  loading.value = true;
  proxy
    .$http('post', '/v1/dc/create', {
      descr: intro.value,
      fileUrl: upload.value,
      marketId: property.value,
      name: name.value,
      overTime: showTime.value,
      price: price.value,
      sellType: sellType.value - 1,
      seriesId: seriesId.value,
      seriesType: series.value - 1,
      stock: number.value,
      storageType: 0,
      imgDescr: plotUploadList.value.map((item) => item.url).join(','),
    })
    .then((res) => {
      successPopup.value = true;
    })
    .thenError((res) => {
      Toast(res.msg);
    })
    .all((res) => {
      loading.value = false;
    });
});

let rate = ref(0);
function getRate() {
  proxy
    .$http('post', '/v1/dc/commission', {})
    .then((res) => {
      rate.value = res.data;
    });
}
getRate();

function showSelectSeries() {
  if (!seriesList.value.length) {
    Toast('请先添加系列');
    return;
  }
  selectSeries.value = true;
}
</script>
<style lang="less" scoped></style>
