<template>
  <div class="listViewBox">
    <van-pull-refresh
      v-if="!showEmpty"
      v-model="refreshing"
      :disabled="!pullRefresh"
      @refresh="reset"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :offset="100"
        @load="onLoad"
      >
        <slot :data="list" />
      </van-list>
    </van-pull-refresh>
    <template v-else>
      <Empty
        ref="empty"
        :class="emptyClass"
        :title="empty"
        :type="emptyType"
      />
    </template>
  </div>
</template>
<script>
export default {
  name: 'ListView',
  // mixins: [],
  // components: {},
  props: {
    getList: {
      type: Function,
      default() {},
    },
    empty: {
      type: String,
      default: '',
    },
    emptyType: {
      type: String,
      default: 'noData',
    },
    emptyClass: {
      type: String,
      default: '',
    },
    pullRefresh: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasNextPage: true,
      loading: false,
      finished: false,
      refreshing: false,
      showEmpty: false,
      list: [],
      page: 1,
    };
  },
  watch: {
    page: {
      handler(res) {
        this.getListBefore();
      },
      immediate: true,
    },
  },
  // created() {},
  // mounted () {},
  methods: {
    onLoad() {
      if (this.list.length && this.hasNextPage) {
        this.page++;
      } else {
        this.loading = false;
        if (this.page !== 1) {
          this.finished = true;
        } else {
          this.finished = false;
        }
        this.judgeEmpty();
      }
    },
    reset() {
      this.hasNextPage = true;
      this.loading = false;
      this.finished = false;
      this.refreshing = false;
      this.showEmpty = false;
      this.list = [];
      if (this.page === 1) {
        this.getListBefore();
      } else {
        this.page = 1;
      }
    },
    async getListBefore() {
      this.loading = true;
      let res = await this.getList(this.page);
      let arr = res.data.list;
      this.hasNextPage = res.data.hasNextPage;
      this.loading = false;
      if (typeof arr === 'undefined') {
        arr = [];
      }
      if (this.page === 1) {
        this.list = arr;
      } else {
        this.list = this.list.concat(arr);
      }

      if (this.refreshing) {
        this.refreshing = false;
      }

      this.judgeEmpty();
    },
    judgeEmpty() {
      if (!this.list.length && this.page === 1 && !this.refreshing && this.empty) {
        this.showEmpty = true;
      } else {
        this.showEmpty = false;
      }
    },
  },
  // computed: {},
  // filters: {},
  // beforeDestroy () {},
};
</script>
<style scoped lang="less">
.listViewBox {
  flex: auto;
  display: flex;
  flex-direction: column;
  .van-pull-refresh {
    flex: auto;
  }
}
</style>
