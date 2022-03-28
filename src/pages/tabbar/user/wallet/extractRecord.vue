<template>
  <NavBar title="提现记录" />
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
          class="card px-4 grid grid-cols-3 text-xs2 gap-y-3 py-4 text-grayCard mb-4 overflow-hidden relative"
        >
          <div
            class="absolute top-0 right-0 w-17 text-xs leading-4 text-right pr-3 py-1"
            :style="{
              'background': `linear-gradient(-90deg, ${item.statusColor}, white)`,
              color: item.textColor,
            }"
          >
            <span>{{ item.status }}</span>
          </div>
          <div
            class="text-blackDefault text-base mt-1.5"
          >
            到账金额
          </div>
          <div
            class="col-span-2 text-right truncate text-redLine text-base font-semibold mt-4"
          >
            ¥ {{ $formatPrice(item.actualAmount, 2, true) }}
          </div>
          <van-divider
            class=" my-0 col-span-3 -mt-2"
          />
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
          <div>申请时间：</div>
          <div class="col-span-2 text-right truncate">
            {{ item.createTime }}
          </div>
          <div>订单编号：</div>
          <div class="col-span-2 text-right truncate">
            {{ item.id }}
          </div>
          <template v-if="item.failReason">
            <div
              class="col-span-2 truncate text-orangeTip"
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
    let statusColor = 'red';
    let textColor = 'red';
    return {
      ...item,
      id: item.id,
      status: (() => {
        switch (item.status) {
          case 1:
            statusColor = '#FFE1C7';
            textColor = '#FF7400';
            return '审核中';
          case 2:
            statusColor = '#D0EDBD';
            textColor = '#5DBD1D';
            return '已完成';
          case 3:
            statusColor = '#FFD5D5';
            textColor = '#D42E2E';
            return '已拒绝';
        }
      })(),
      statusColor,
      textColor,
    };
  });
  return res;
}
</script>
<style lang="less" scoped></style>
