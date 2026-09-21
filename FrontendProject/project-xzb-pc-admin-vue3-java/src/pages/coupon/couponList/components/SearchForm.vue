<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="活动编号：" name="id">
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
          <t-form-item label="活动名称：" name="name">
            <t-input
              v-model="formData.name"
              class="form-item-content"
              type="search"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="优惠券类型：" name="name" :label-width="84">
            <t-select
              v-model="formData.type"
              class="form-item-content"
              :options="COUPON_TYPE"
              placeholder="请选择"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="发放状态：" name="name">
            <t-select
              v-model="formData.status"
              class="form-item-content"
              :options="GRANT_STATUS"
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
import { COUPON_TYPE, GRANT_STATUS } from '@/constants'
// 表单数据
const formData = ref({
  id: null,
  name: null,
  type: null,
  status: null
})
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch'])
// 重置表单数据
const searchForm = {
  id: null,
  name: null,
  type: null,
  status: null
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
</script>

<style lang="less" scoped src="../../index.less"></style>

