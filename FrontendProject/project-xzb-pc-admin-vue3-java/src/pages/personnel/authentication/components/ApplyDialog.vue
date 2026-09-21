<!-- 冻结弹窗 -->
<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="title"
    :width="728"
    :footer="false"
    :on-close="onClickCloseBtn"
  >
    <template #body>
      <TableList
        :list-data="formData"
        :pagination="undefined"
        :isActive="1"
      ></TableList>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TableList from './TableList.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  title: {
    type: String,
    default: '新建产品'
  }
})

// 触发父级事件
const emit: Function = defineEmits(['handleClose', 'fetchData'])
// 弹窗
const formVisible = ref(false)
// 表单数据
const formData = ref({
  accountLockReason: ''
})
// 弹窗标题
const title = ref()

// 点击取消关闭
const onClickCloseBtn = () => {
  formVisible.value = false
  emit('handleClose')
}
// 点击叉号关闭
// 监听器，监听父级传递的visible值，控制弹窗显示隐藏
watch(
  () => props.visible,
  () => {
    formVisible.value = props.visible
    title.value = props.title
  }
)
// 监听器，监听父级传递的data值，控制表单数据
watch(
  () => props.data,
  (val) => {
    formData.value = JSON.parse(JSON.stringify(val))
  }
)

defineExpose({
  onClickCloseBtn
})
</script>
<style lang="less" scoped>
.btn-submit {
  margin-left: 15.5px;
  width: 60px;
}

.nickname {
  margin-right: 2px;
  z-index: 100;
  color: var(--color-bk4);
}
:deep(.t-textarea__limit) {
  color: var(--color-bk4);
  right: 10px;
}
:deep(.t-form__item) {
  margin-bottom: 56px;
}
:deep(.min-h) {
  min-height: 300px;
  .tableBoxs {
    margin: 0;
  }
}
:deep(.t-dialog__body) {
  padding: 0;
  .baseList {
    padding-top: 0;
    border-radius: 7px;
    min-height: auto;
    .t-table {
      border-radius: 7px;
      th {
        background-color: #fff !important;
        border-bottom: none;
        &::after {
          position: absolute;
          right: 0;
          bottom: -10px;
          content: '';
          border: none;
          width: 100%;
          height: 10px;
          transform: scaleY(-1); // 水平翻转
          background-image: linear-gradient(
            180deg,
            #ffffff00 0%,
            #6361601a 100%
          );
        }
      }
    }
  }
}
</style>
