<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="服务类型：" name="name">
            <t-select
              v-model="formData.serveTypeId"
              class="form-item-content"
              :options="typeSelectList"
              placeholder="请选择"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="服务名称：" name="name">
            <t-input
              v-model="formData.contactsName"
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
        <t-col  class="citySelect">
          <t-form-item label="" name="name" label-width="0">
            <t-select
              v-model="formData.cityCode"
              class="form-item-content"
              :options="citySelectList"
              placeholder="请选择"
              clearable
            />
          </t-form-item>
        </t-col>
      </t-row>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { ORDER_STATUS } from '@/constants'
import { forEach } from 'lodash'

const props = defineProps({
  typeSelect: {
    type: Array<{
      id: string
      name: string
    }>,
    default: () => {
      return []
    }
  },
  cityList: {
    type: Array<{
      id: string
      name: string
      cityCode: string
    }>,
    default: () => {
      return []
    }
  }
})
const typeSelectList = ref([]) // 服务类型下拉框数据
const citySelectList = ref([]) // 城市下拉框数据
// 表单数据
const formData = ref({
  serveTypeId: '',
  contactsName: '',
  cityCode: ''
})
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch', 'handleReset'])
// 表单数据
const searchForm = {
  serveTypeId: '',
  contactsName: '',
  cityCode: ''
}
// 重置表单
const handleReset = () => {
  formData.value = { ...searchForm }
  formData.value.cityCode = props.cityList[0]?.cityCode
  emit('handleSearch', formData.value)
}
// 搜索表单
const handleSearch = () => {
  emit('handleSearch', formData.value)
}
watchEffect(() => {
  typeSelectList.value = props.typeSelect.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  citySelectList.value = props.cityList.map((item) => {
    return {
      label: item.name,
      value: item.cityCode
    }
  })
  formData.value.cityCode = props.cityList[0]?.cityCode
})
</script>

<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.formBox{
  position: relative;
  .citySelect{
    position: absolute;
    right: 8px;
  }
}
</style>
