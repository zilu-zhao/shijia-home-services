<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="订单编号：" name="id">
            <t-input
              v-model="formData.id"
              class="form-item-content"
              type="search"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item
            label="服务人员电话："
            name="serveProviderStaffPhone"
            :label-width="98"
          >
            <t-input
              v-model="formData.serveProviderStaffPhone"
              class="form-item-content"
              type="search"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="订单状态：" name="ordersStatus">
            <t-select
              v-model="formData.ordersStatus"
              class="form-item-content"
              :options="[
                {
                  label: '订单完成',
                  value: '500'
                },
                {
                  label: '已取消',
                  value: '600'
                },
                {
                  label: '已关闭',
                  value: '700'
                }
              ]"
              placeholder="请选择"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="交易结束时间：" name="status" :label-width="98">
            <t-date-range-picker
              v-model="formData.createTime"
              placeholder="日期"
              :presets="presets"
              clearable
              allow-input
              :disable-date="{
                after: props.initSearch[1]
              }"
              @change="onCurrencyChange"
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="支付状态：" name="payStatus">
            <t-select
              v-model="formData.payStatus"
              class="form-item-content"
              :options="TRADE_STATUS"
              placeholder="请选择"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="退款状态：" name="refundStatus">
            <t-select
              v-model="formData.refundStatus"
              class="form-item-content"
              :options="[
                { value: 2, label: '退款成功' },
                { value: 3, label: '退款失败' }
              ]"
              placeholder="请选择"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col class="searchBtn">
          <button class="bt-grey wt-60" @click="handleReset()">重置</button>
          <button class="bt wt-60" @click="handleSearch()">搜索</button>
        </t-col>
      </t-row>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TRADE_STATUS } from '@/constants'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'

const props = defineProps({
  initSearch: {
    type: Array,
    default: () => []
  }
})
// 表单数据
const formData = ref({
  id: null,
  serveProviderStaffPhone: null,
  ordersStatus: null,
  createTime: props.initSearch,
  payStatus: null,
  refundStatus: null
})
// 时间选择器
const dateRange = ref(props.initSearch)
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch', 'handleReset'])
// 表单数据，重置时使用
const searchForm = {
  id: null,
  serveProviderStaffPhone: null,
  ordersStatus: null,
  createTime: props.initSearch,
  payStatus: null,
  refundStatus: null
}
// 重置表单
const handleReset = () => {
  formData.value = { ...searchForm }
  emit('handleSearch', formData.value)
}
// 搜索表单
const handleSearch = () => {
  emit('handleSearch', formData.value)
}
// 时间选择器，时间间隔不能大于365天
const onCurrencyChange = (val) => {
  // 如果val为的第一项和第二项之间的时间间隔大于365天，清空时间并提示
  if (val.length <= 0) {
    dateRange.value = []
  } else {
    if (dayjs(val[1]).diff(dayjs(val[0]), 'day') > 365) {
      // formData.value.createTime = []
      MessagePlugin.error('时间间隔不能大于365天')
    }
  }
}
// 时间选择器tag
const presets = ref({
  近一周: [
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ],
  近三天: [
    new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
    new Date()
  ],
  近一天: [new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), new Date()]
})
</script>

<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
@media screen and (min-width: 1705px) and (max-width: 2051px) {
  .formBox .t-row > div.t-col {
    max-width: 25% !important;
  }
}
</style>
