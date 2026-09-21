<!-- 新增编辑区域弹窗 -->
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
        on-cancel="onClickCloseBtn"
        :reset-type="resetType"
        @submit="onSubmit"
      >
        <t-form-item label="地区选择：" name="cityCode">
          <t-cascader
              v-model="formData.cityCode"
              class="form-item-content wt-400"
              placeholder="请选择"
              :disabled="edit"
              :style="{ minWidth: '134px' }"
              clearable
              @change="(value,context)=>onChangeCity(value,context)"
              :options="options"
            />
        </t-form-item>
        <t-form-item label="区域负责人：" name="managerName">
          <t-input
            v-model="formData.managerName"
            class="wt-400"
            placeholder="请输入"
            clearable
          >
          </t-input>
        </t-form-item>
        <t-form-item label="手机号码：" name="managerPhone">
          <t-input
            v-model="formData.managerPhone"
            class="wt-400"
            placeholder="请输入"
            clearable
          >
          </t-input>
        </t-form-item>
        <t-form-item style="float: right">
          <div class="bt bt-grey btn-submit" @click="onClickCloseBtn">
            <span>取消</span>
          </div>
          <button theme="primary" type="submit" class="bt btn-submit">
            <span>保存</span>
          </button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {  ValidateResultContext } from 'tdesign-vue-next'
import {
  validateText10,
  validatePhone
} from '@/utils/validate'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  edit: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '新建产品'
  },
  cityList:{
    type:Array,
    default:()=>{
      return []
    }
  }
})
// 重置表单
const resetType = ref('empty')
// 表单
const form = ref()
// 触发父级事件
const emit: Function = defineEmits(['handleClose', 'confirmEdit'])
// 弹窗
const formVisible = ref(false)
// 表单数据
const formData = ref({
  cityCode: '',
  name: '',
  managerPhone: '',
  managerName: ''
})
const options = ref([])
// 弹窗标题
const title = ref()
// 提交表单
const onSubmit = (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    emit('confirmEdit', formData.value)
  }
}
// 点击取消关闭
const onClickCloseBtn = () => {
  // 重置表单
  form.value.reset()
  formVisible.value = false
  emit('handleClose')
}
// 地区选择
const onChangeCity = (value,context) => {
  formData.value.cityCode = value
  formData.value.name = context.node.label
}
// 点击叉号关闭
// 监听器，监听父级传递的visible值，控制弹窗显示隐藏
watch(
  () => props.visible,
  () => {
    if(props.edit){
      formData.value = JSON.parse(JSON.stringify(props.formData))
    }else{
      form.value.reset()
    }
    formVisible.value = props.visible
    title.value = props.title
    options.value = props.cityList
  }
)

// 监听器，监听父级传递的data值，控制表单数据

// 表单校验
const rules = {
  cityCode: [
    // 手机号校验
    {
      required: true,
      message: '请选择区域',
      type: 'error',
      trigger: 'change'
    },
  ],
  managerPhone: [
    // 调用次数校验
    {
      required: true,
      message: '请输入手机号',
      type: 'error',
      trigger: 'blur'
    },
    {
      validator: validatePhone,
      message: '请输入正确格式的手机号',
      type: 'error',
      trigger: 'change'
    },
    {
      validator: validatePhone,
      message: '请输入正确格式的手机号',
      type: 'error',
      trigger: 'blur'
    }
  ],
  managerName: [
    // 昵称校验
    {
      required: true,
      message: '请输入姓名',
      type: 'error',
      trigger: 'blur'
    },
    {
      validator: validateText10,
      message: '请输入至少2个字符,至多10个字符',
      type: 'error',
      trigger: 'blur'
    }
  ],
}
// 暴露给父级的方法
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
</style>
../city