<template>
  <NavBar title="提现详情" />
  <div class="pageCard-sm">
    <Space height="10" />
    <ListView
      ref="listView"
      :get-list="getList"
      empty="暂无数据"
      pull-refresh
    >
      <template #default="{ data }">
        <div
          v-for="item of data"
          :key="item"
          class="card px-4 grid grid-cols-3 text-xs2 gap-y-3 py-4 text-grayCard mb-4"
        >
          <div
            class="text-blackDefault text-base font-semibold"
          >
            提现金额
          </div>
          <div
            class="col-span-2 text-right truncate text-redLine text-base font-semibold"
          >
            ¥ {{ $formatPrice(item.actualAmount, 2, true) }}
          </div>

          <div>申请金额：</div>
          <div class="col-span-2 text-right truncate">
            ¥ {{ $formatPrice(item.amount, 2, true) }}
          </div>
          <div>手续费：</div>
          <div class="col-span-2 text-right truncate">
            {{ item.fee }}
          </div>
          <div>收款银行：</div>
          <div class="col-span-2 text-right truncate">
            {{ item.cardName }}
          </div>
          <div>银行卡：</div>
          <div class="col-span-2 text-right truncate">
            {{ item.cardNo }}
          </div>
          <div>订单编号：</div>
          <div class="col-span-2 text-right truncate">
            {{ item.id }}
          </div>
          <div>申请时间：</div>
          <div class="col-span-2 text-right truncate">
            {{ item.createTime }}
          </div>
          <div>状态：</div>
          <div class="col-span-2 text-right truncate">
            {{ item.status }}
          </div>
          <template v-if="item.failReason">
            <div>拒绝原因：</div>
            <div
              class="col-span-2 text-right truncate text-orangeTip"
            >
              {{ item.failReason }}
            </div>
          </template>
        </div>
      </template>
    </ListView>
  </div>
</template>
<script setup>
import { ref, computed, getCurrentInstance } from 'vue';
let { proxy } = getCurrentInstance();

async function getList(page) {
  let res = await proxy.$http('get', '/v1/assets/withdrawRecord', {
    page: page,
    size: 5,
  });
  res.data.list = res.data.list.map((item) => {
    return {
      ...item,
      id: item.id,
      status: (() => {
        switch (item.status) {
          case 1:
            return '提现中';
          case 2:
            return '提现成功';
          case 3:
            return '提现失败';
        }
      })(),
    };
  });
  return res;
}
</script>
<style lang="less" scoped></style>
