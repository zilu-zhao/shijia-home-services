<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="订单编号：" name="name" :label-width="70">
            <t-input
              v-model="formData.ordersCode"
              class="form-item-content"
              type="search"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="服务人员电话：" name="name" :label-width="98">
            <t-input
              v-model="formData.contactsName"
              class="form-item-content"
              type="search"
              placeholder="请输入"
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
          <t-form-item label="交易完成时间：" name="status" :label-width="98">
            <t-date-range-picker
              v-model="formData.createTime"
              placeholder="日期"
              :presets="presets"
              :disable-date="{
                before: dateRange[0],
                after: dateRange[1]
              }"
              @pick="handleCellClick"
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
import { ref, watchEffect } from 'vue'
import { ORDER_STATUS } from '@/constants'
import dayjs from 'dayjs'
import { forEach } from 'lodash'
// 表单数据
const formData = ref({
  ordersCode: '',
  contactsName: '',
  ordersStatus: '',
  createTime: []
})
const dateRange = ref([])
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch', 'handleReset'])
// 表单数据
const searchForm = {
  ordersCode: '',
  contactsName: '',
  ordersStatus: '',
  createTime: []
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
function handleCellClick(value) {
  // 确定传递的日期前一年的12月31日和今年的12月31日，放入数组中
  dateRange.value = [
    dayjs(value).subtract(1, 'year').endOf('year').toDate(),
    dayjs(value).endOf('year').toDate()
  ]
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
