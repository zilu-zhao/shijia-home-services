<!-- 新增编辑弹窗 -->
<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="title"
    :width="628"
    :footer="false"
    :on-close="onClickCloseBtn"
  >
    <template #body>
      <!-- 表单内容 -->
      <t-form
        ref="form"
        :data="formData"
        :rules="rules"
        :label-width="80"
        on-cancel="onClickCloseBtn"
        @submit="onSubmit"
      >
        <t-form-item :label="labelTitle" name="description"
          ><t-textarea
            v-model="formData.description"
            class="wt-400"
            placeholder="您的认可是我们最大的欣慰"
          >
          </t-textarea>
        </t-form-item>
        <t-form-item>
          <div class="tips">
            <span @click="transferText('您的认可是我们最大的欣慰')"
              >您的认可是我们最大的欣慰</span
            >
            <span @click="transferText('对于您的反馈，我们会认真考虑')"
              >对于您的反馈，我们会认真考虑</span
            >
          </div>
        </t-form-item>
        <t-form-item class="fr">
          <div class="bt bt-grey btn-submit" @click="onClickCloseBtn">
            <span>取消</span>
          </div>
          <button theme="primary" type="submit" class="bt btn-submit">
            <span>确定</span>
          </button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ValidateResultContext } from 'tdesign-vue-next'
// const resetType = ref('empty')
const form = ref()
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
    default: '回复评价'
  },
  targetType: {
    type: String,
    default: '0'
  },
  labelTitle: {
    type: String,
    default: '回复内容：'
  }
})
// 触发父组件事件
const emit: Function = defineEmits(['replayComment', 'handleClose'])
const formVisible = ref(false)
const formData = ref({
  description: ''
})
const title = ref()
// 提交
const onSubmit = (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    if (title.value === '回复评价') {
      emit('replayComment', formData.value.description)
    } else {
      emit('batchReply', formData.value.description)
    }
  }
}
const onClickCloseBtn = () => {
  // 重置表单
  form.value.reset()
  formVisible.value = false
  emit('handleClose')
}
// 点击叉号关闭

watch(
  () => props.visible,
  () => {
    formVisible.value = props.visible
    title.value = props.title
  }
)

watch(
  () => props.data,
  (val) => {
    formData.value = JSON.parse(JSON.stringify(val))
  }
)

// 表单校验
const rules = {
  description: [
    {
      required: true,
      message: '请输入回复内容',
      type: 'error',
      trigger: 'blur'
    },
    {
      validator: (val) => {
      },
      message: `请输入至少2个字符,至多个字符`,
      type: 'error',
      trigger: 'blur'
    }
  ]
}
// 点击传递文字至输入框
const transferText = (text) => {
  formData.value.description = text
}
// 暴露onClickCloseBtn方法给父组件
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

.tips {
  display: flex;
  width: 400px;
  font-size: 12px;
  span {
    margin-right: 10px;
    background-color: #e7e7e7;
    color: var(--color-bk3);
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 3px;
    cursor: pointer;
  }
}
:deep(.t-form-item__description) {
  margin-bottom: 10px;
}
:deep(.t-form) {
  margin-left: 41px;
}
</style>
