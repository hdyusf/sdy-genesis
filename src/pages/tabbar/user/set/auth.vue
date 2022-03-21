<template>
  <NavBar
    title="实名认证"
  />
  <div class=" pageCard-sm">
    <Space height="30" />
    <div class="text-base font-semibold">
      上传身份证照片
    </div>
    <Space height="8" />
    <div class=" text-xs2 text-grayDefault">
      认证通过后资料不可修改，平台会保护你的个人信息
    </div>
    <Space height="25" />
    <div class="flex items-center justify-center relative h-28">
      <div class="flex-auto h-full relative">
        <van-uploader :after-read="frontUpload">
          <van-image
            class="rounded-lg overflow-hidden"
            :width="parseInt($pxToPxRatio(165), 10)"
            :height="parseInt($pxToPxRatio(105), 10)"
            fit="cover"
            :src="frontUploadUrl || a2"
          />
        </van-uploader>
      </div>
      <Space width="15" />
      <div class="flex-auto h-full relative">
        <van-uploader :after-read="backUpload">
          <van-image
            class="rounded-lg overflow-hidden"
            :width="parseInt($pxToPxRatio(165), 10)"
            :height="parseInt($pxToPxRatio(105), 10)"
            fit="cover"
            :src="backUploadUrl || a1"
          />
        </van-uploader>
      </div>
    </div>
    <Space height="20" />
    <div class=" px-2.5 ring-1 rounded-lg2 ring-gray-200 flex items-center">
      <div class="flex-shrink-0 text-sm text-grayDefault">
        姓名：
      </div>
      <van-field
        v-model="name"
        class="text-sm"
        type="text"
        placeholder="请输入姓名"
      />
    </div>
    <Space height="10" />
    <div class=" px-2.5 ring-1 rounded-lg2 ring-gray-200 flex items-center">
      <div class="flex-shrink-0 text-sm text-grayDefault">
        身份证号：
      </div>
      <van-field
        v-model="number"
        class="text-sm"
        type="text"
        placeholder="请输入身份证"
      />
    </div>
    <div
      class="fixedBottomButton"
    >
      <van-button
        type="danger"
        block
        round
        :disabled="!name && !number && !frontUploadUrl && !backUploadUrl"
        :loading="loading"
        @click="submit"
      >
        提交
      </van-button>
    </div>
  </div>
</template>
<script setup>
import { Toast } from 'vant';
import { ref, getCurrentInstance } from 'vue';
import { isIdentityCard } from 'validator';
import a1 from './images/a1.png';
import a2 from './images/a2.png';
import a3 from './images/a3.png';
import { useStore } from 'vuex';

let {proxy} = getCurrentInstance();
let store = useStore();

let name = ref('');
let number = ref('');
let frontUploadUrl = ref('');
let backUploadUrl = ref('');

function getDetail() {
  proxy.$http('post', '/v1/user/authenticationDetails', {})
    .then(res => {
      name.value = res.data.cardName;
      number.value = res.data.cardId;
      frontUploadUrl.value = res.data.frontUrl;
      backUploadUrl.value = res.data.backUrl;
    });
}
getDetail();

const frontUpload = (file) => {
  proxy.$http('file', '/v1/cdn/uploadImg', {
    file: file.file
  }).then((res) => {
    frontUploadUrl.value = res.data;
  });
};
const backUpload = (file) => {
  proxy.$http('file', '/v1/cdn/uploadImg', {
    file: file.file
  }).then((res) => {
    backUploadUrl.value = res.data;
  });
};

let loading = ref(false);
let submit = proxy.$debounce(() => {
  if (!name.value) {
    Toast('请输入姓名');
    return;
  }
  if (!number.value) {
    Toast('请输入身份证号');
    return;
  }
  if (!isIdentityCard(number.value, ['zh-CN'])) {
    Toast('请输入正确的身份证号');
    return;
  }
  if (!frontUploadUrl.value) {
    Toast('请上传身份证正面照');
    return;
  }
  if (!backUploadUrl.value) {
    Toast('请上传身份证反面照');
    return;
  }
  loading.value = true;
  proxy.$http('post', '/v1/user/authentication', {
    'backUrl': backUploadUrl.value,
    'cardId': number.value,
    'cardName': name.value,
    'frontUrl': frontUploadUrl.value,
    'id': '',
    'passportUrl': '',
    'regions': '中国',
    'type': '0'
  })
    .then(res => {
      Toast.success('提交成功');
      proxy.$router.back();
    }).thenError(res => {
      Toast(res.msg);
    }).all(res => {
      loading.value = false;
    });
});

</script>
<style lang="less" scoped>
</style>
