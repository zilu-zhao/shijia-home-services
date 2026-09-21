<!-- 客户管理搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="100">
      <t-row>
        <t-col>
          <t-form-item label="客户姓名：" name="nickname" :label-width="70">
            <t-input
              v-model="formData.nickname"
              class="form-item-content"
              type="search"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="手机号码：" name="phone">
            <t-input
              v-model="formData.phone"
              class="form-item-content"
              type="search"
              placeholder="请输入"
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
// 表单数据
const formData = ref({
  nickname: '',
  phone: ''
})
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch'])
// 表单数据
const searchForm = {
  nickname: '',
  phone: ''
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
