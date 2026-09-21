<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="规则编号：" name="name">
            <t-input
              v-model="formData.index"
              class="form-item-content"
              type="search"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="状态：" name="status" :label-width="42">
            <t-select
              v-model="formData.status"
              class="form-item-content"
              :options="STATUS"
              placeholder="请选择"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="规则：" name="serviceCallNumber">
            <t-input
              v-model="formData.serviceCallNumber"
              class="form-item-content"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <!-- 选择日期区间-->
        <t-col>
          <t-form-item label="创建时间：" name="type">
            <t-date-range-picker
              v-model="formData.updateTime"
              placeholder="日期"
              :presets="presets"
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
import { STATUS } from '@/constants'
// 表单数据
const formData = ref({
  index: '',
  status: '',
  serviceCallNumber: '',
  updateTime: []
})
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch', 'handleReset'])
// 表单数据
const searchForm = {
  index: '',
  status: undefined,
  serviceCallNumber: undefined,
  updateTime: []
}
// 重置表单
const handleReset = () => {
  formData.value = { ...searchForm }
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
}) // 时间选择器tag
</script>


<style lang="less" scoped src="../../index.less"></style>
