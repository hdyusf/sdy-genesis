<template>
  <div class="w-17 flex items-center justify-center">
    <div
      v-if="!sendCodeTime"
      class="text-sm text-blueDefault"
      :class="{'text-grayDefault': loading}"
      @click="sendCode"
    >
      发送验证码
    </div>
    <template v-else>
      <van-count-down
        class="text-grayDefault"
        :time="sendCodeTime"
        format="ss"
        @finish="sendCodeTime = ''"
      />
      <i class="text-grayDefault">s</i>
    </template>
  </div>
</template>
<script>
export default {
  name: 'SendCode',
  // mixins: [],
  // components: {},
  props: {
    url: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    error: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      loading: false,
      sendCodeTime: '',
    };
  },
  methods: {
    sendCode() {
      if (this.loading === true) return;
      if (!this.phone) {
        this.$toast('手机号不能为空');
        this.error();
        return;
      }
      this.loading = true;
      this.$http('post', this.url, {
        areaCode: '86',
        phone: this.phone,
      })
        .then(res => {
          this.$toast.success('发送成功');
          this.sendCodeTime = 60 * 1000;
        })
        .all(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped lang="less">
</style>
