<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="订单编号：" name="name">
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
          <t-form-item label="客户电话：" name="name">
            <t-input
              v-model="formData.contactsPhone"
              class="form-item-content"
              type="search"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="下单时间：" name="status">
            <t-date-range-picker
              v-model="formData.createTime"
              placeholder="日期"
              :presets="presets"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="订单状态：" name="serveTypeId">
            <t-select
              v-model="formData.ordersStatus"
              class="form-item-content"
              :options="ORDER_STATUS"
              placeholder="请选择"
              clearable
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
              :options="REFUND_STATUS"
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
import { ORDER_STATUS,TRADE_STATUS , REFUND_STATUS} from '@/constants'
// 表单数据
const formData = ref({
  id: '',
  contactsPhone: '',
  ordersStatus: '',
  payStatus: '',
  createTime: [],
  refundStatus: ''
})
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch', 'handleReset'])
// 表单数据，重置数据
const searchForm = {
  id: '',
  contactsPhone: '',
  ordersStatus: '',
  payStatus: '',
  createTime: [],
  refundStatus: ''
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
