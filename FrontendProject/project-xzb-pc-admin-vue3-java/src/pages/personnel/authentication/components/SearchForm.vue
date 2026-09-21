<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="真实姓名：" name="name">
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
          <t-form-item label="身份证号：" name="idCardNo">
            <t-input
              v-model="formData.idCardNo"
              class="form-item-content"
              type="search"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="审核状态：" name="auditStatus">
            <t-radio-group v-model="formData.auditStatus">
              <t-radio :value="2">全部</t-radio>
              <t-radio :value="1">已审核</t-radio>
              <t-radio :value="0">未审核</t-radio>
            </t-radio-group>
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="认证状态：" name="certificationStatus">
            <t-radio-group v-model="formData.certificationStatus">
              <t-radio :value="1">全部</t-radio>
              <t-radio :value="2">认证通过</t-radio>
              <t-radio :value="3">认证失败</t-radio>
            </t-radio-group>
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
import { AUTH_STATUS , AUDIT_STATUS } from '@/constants'
const props = defineProps({
  initSearch: {
    type: Number,
    default: 0
  },
  typeSelect: {
    type: Array<{
      id: string
      name: string
    }>,
    default: () => {
      return []
    }
  }
})
// 表单数据
const formData = ref({
  name: '',
  idCardNo: '',
  auditStatus: 2,
  certificationStatus: 1
})
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch', 'handleReset'])
// 表单数据
const searchForm = {
  name: '',
  idCardNo: '',
  auditStatus: 2,
  certificationStatus: 1
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
