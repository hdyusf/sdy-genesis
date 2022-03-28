<template>
  <NavBar title="签约艺术家" />
  <div class="relative z-1 flex-auto bg-[#F1F0F0]">
    <van-image
      class="w-full h-full absolute top-0 left-0 -z-1"
      :height="parseInt($pxToPxRatio(798), 10)"
      fit="cover-top"
      :src="bg1"
    />
    <div class=" pageCard-sm">
      <Space height="176" />
      <div class="card px-5 text-sm">
        <Space height="20" />
        <div class="flex items-center">
          <div class=" w-14">
            手机号
          </div>
          <div class="border rounded-md px-3 flex-auto">
            <van-field
              v-model="phone"
              size="normal"
              type="tel"
              placeholder="请输入手机号"
              class="text-sm"
            />
          </div>
        </div>
        <Space height="15" />
        <div class="flex items-center">
          <div class=" w-14">
            作品
          </div>
          <van-uploader
            :after-read="uploadAfter"
            :disabled="uploadList.length >= 3"
          >
            <div class="border rounded-md px-3 py-2 text-sm text-grayTip">
              上传（{{ uploadList.length }}/3）
            </div>
          </van-uploader>
        </div>
        <div
          v-if="uploadList.length"
        >
          <div
            v-for="(item, index) of uploadList"
            :key="item"
          >
            <div
              class=" flex items-center justify-between rounded-md bg-[#F9F9F9] pl-5 pr-2 py-2 mt-3 shadow-md mb-1"
            >
              <div class=" w-48 truncate">
                {{ item.name }}
              </div>
              <Icon
                type="icon-sousuo-guanbi"
                size="17"
                @click="() => removeUploadList(index)"
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
        <Space height="15" />
        <div class="flex items-start mb-5">
          <div class=" w-14">
            原因
          </div>
          <div class="border rounded-md px-3 flex-auto">
            <van-field
              v-model="cause"
              type="textarea"
              :autosize="{ minHeight: 80 }"
              placeholder="请输入您想成为艺术家的原因"
              show-word-limit
              maxlength="200"
            />
          </div>
        </div>
        <div class="flex items-start mb-5">
          <div class=" w-14">
            介绍
          </div>
          <div class="border rounded-md px-3 flex-auto">
            <van-field
              v-model="intro"
              type="textarea"
              :autosize="{ minHeight: 80 }"
              placeholder="请输入您的个人介绍，此文案向用户展示"
              show-word-limit
              maxlength="200"
            />
          </div>
        </div>
        <div class="flex items-center justify-center">
          <van-checkbox
            v-model="checked"
            class=" h-min"
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
            我已阅读并同意<span class="text-blueDefault">《艺术家协议》</span>
          </div>
        </div>
        <Space height="15" />
        <van-button
          type="danger"
          round
          block
          :disabled="!checked || !uploadList.length || !phone || !cause || !intro"
          :loading="loading"
          @click="submit"
        >
          申请
        </van-button>
        <Space height="31" />
      </div>
      <Space height="28" />
    </div>
  </div>
  <van-popup
    v-model:show="successPopup"
    :close-on-click-overlay="false"
    class="transparent overflow-visible"
  >
    <div class="px-9 bg-white rounded-lg2 w-80 text-blackDefault flex flex-col items-center">
      <Space height="23" />
      <van-image
        :width="parseInt($pxToPxRatio(162), 10)"
        :height="parseInt($pxToPxRatio(160), 10)"
        fit="cover"
        :src="b1"
      />
      <Space height="40" />
      <div class=" text-base font-semibold text-center">
        提交成功
      </div>
      <Space height="20" />
      <div class=" text-sm text-grayTip text-center">
        申请之后我们会在24小时内进行审核
      </div>
      <Space height="20" />
      <div class=" text-sm text-grayTip text-center">
        请耐心等待
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
    v-model:show="errorPopup"
    :close-on-click-overlay="false"
    class="transparent overflow-visible"
  >
    <div class="px-9 bg-white rounded-lg2 w-80 text-blackDefault flex flex-col items-center">
      <Space height="23" />
      <van-image
        :width="parseInt($pxToPxRatio(141), 10)"
        :height="parseInt($pxToPxRatio(156), 10)"
        fit="cover"
        :src="b2"
      />
      <Space height="40" />
      <div class=" text-base font-semibold text-center">
        申请失败
      </div>
      <Space height="20" />
      <div class=" text-sm text-grayTip text-center">
        原因：{{ failReason }}
      </div>
      <Space height="30" />
      <Icon
        class="absolute z-1 left-1/2 -bottom-4 transform -translate-x-1/2 translate-y-full"
        type="icon-close_circle"
        size="26"
        @click="() => errorPopup = false"
      />
    </div>
  </van-popup>
  <van-popup
    v-model:show="loadingPopup"
    :close-on-click-overlay="false"
    class="transparent overflow-visible"
  >
    <div class="px-9 bg-white rounded-lg2 w-80 text-blackDefault flex flex-col items-center">
      <Space height="23" />
      <van-image
        :width="parseInt($pxToPxRatio(162), 10)"
        :height="parseInt($pxToPxRatio(174), 10)"
        fit="cover"
        :src="b3"
      />
      <Space height="40" />
      <div class=" text-base font-semibold text-center">
        审核中
      </div>
      <Space height="20" />
      <div class=" text-sm text-grayTip text-center">
        申请之后我们会在24小时内进行审核
      </div>
      <Space height="20" />
      <div class=" text-sm text-grayTip text-center">
        请耐心等待
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
</template>
<script setup>
import bg1 from './images/bg1.png';
import d1 from '@/assets/images/d1.png';
import d2 from '@/assets/images/d2.png';
import b1 from './images/b1.png';
import b2 from './images/b2.png';
import b3 from './images/b3.png';
import { ref, watchEffect, getCurrentInstance } from 'vue';
import { Toast } from 'vant';

let {proxy} = getCurrentInstance();

const checked = ref(false);
let phone = ref('');
let cause = ref('');
let intro = ref('');
let uploadList = ref([]);
let successPopup = ref(false);
let errorPopup = ref(false);
let loadingPopup = ref(false);

function uploadAfter(file) {
  proxy.$http('file', '/v1/cdn/uploadImgIpfs', {
    file: file.file
  }).then((res) => {
    uploadList.value.push({
      url: res.data,
      name: file.file.name,
    });
  });
}

let status = ref(0);
let failReason = ref('');
function getDetail() {
  proxy.$http('post', '/v1/artist/details', {})
    .then(res => {
      if (!res.data) return;
      phone.value = res.data.phone;
      cause.value = res.data.reason;
      intro.value = res.data.descr;
      uploadList.value = res.data.works.split(';').map(item => {
        return {
          url: item,
          name: item,
        };
      });
      status.value = res.data.status;
      switch(res.data.status) {
        case 0:
          loadingPopup.value = true;
          break;
        case 1:
          Toast('申请成功');
          proxy.$router.back();
          break;
        case 2:
          errorPopup.value = true;
          break;
      }
      failReason.value = res.data.failReason;
    });
}
getDetail();

function removeUploadList(index) {
  uploadList.value.splice(index, 1);
}

let loading = ref(false);
let submit = proxy.$debounce(() => {
  if (!proxy.$isMobilePhone(phone.value, ['zh-CN'])) {
    Toast('请输入正确的手机号');
    return;
  }

  loading.value = true;
  proxy.$http('post', '/v1/artist/applyFor', {
    'descr': intro.value,
    'phone': phone.value,
    'reason': cause.value,
    'works': uploadList.value.map(item => item.url).join(';'),
  })
    .then(res => {
      successPopup.value = true;
    }).thenError(res => {
      Toast(res.msg);
    }).all(res => {
      loading.value = false;
    });
});
</script>
<style lang="less" scoped>
</style>
