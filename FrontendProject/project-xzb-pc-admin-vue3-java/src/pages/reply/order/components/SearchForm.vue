<template>
  <div class="formBox">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item :label="targetId" name="targetId" :label-width="100">
            <t-input
              v-model="formData.targetId"
              class="form-item-content"
              placeholder="请输入"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="评分等级：" name="scoreLevel">
            <t-select
              v-model="formData.scoreLevel"
              class="form-item-content"
              :options="Score"
              placeholder="请选择"
              clearable
            />
          </t-form-item>
        </t-col>
        <!-- 选择日期区间-->
        <t-col>
          <t-form-item label="评价时间：" name="type">
            <t-date-range-picker
              v-model="formData.updateTime"
              placeholder="日期"
              :presets="presets"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col class="searchBtn">
          <div class="bt-grey wt-60" @click="handleReset()">重置</div>
          <div class="bt wt-60" @click="handleSearch()">搜索</div>
        </t-col>
      </t-row>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
// import { forEach } from 'lodash'
import { Score } from '@/constants'

const props = defineProps({
  replyType: {
    type: String,
    default: '0'
  },
  initSearchId: {
    type: String,
    default: ''
  }
})
// 表单数据
const formData = ref({
  scoreLevel: '',
  targetId: '',
  updateTime: []
})
onMounted(() => {
  formData.value.targetId = props.initSearchId
})

watch(
  () => props.replyType,
  () => {
    formData.value = { ...searchForm }
  }
)
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch', 'handleReset'])
const targetId = ref('评价对象编号：')
// const { listField } = objectTypeStore // 所有code字段
// 搜索表单
const searchForm = {
  scoreLevel: '',
  targetId: '',
  updateTime: []
}
// 重置表单
const handleReset = () => {
  formData.value = { ...searchForm }
  emit('handleReset')
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
// watchEffect(() => {
//   if (props.replyType) {
//     const typeList = ref([])
//     typeList.value = listField.filter((item) => {
//       return item.targetTypeId === props.replyType
//     })
//     forEach(typeList.value, (item) => {
//       if (item.code === 'P10000') {
//         targetId.value = item.name
//         targetId.value += '：'
//       }
//     })
//   }
// })
</script>

<style lang="less" scoped>
.searchBtn {
  div {
    display: inline-block;
    margin: 0 8px;
  }
}
</style>
<style lang="less" scoped src="../../index.less"></style>
