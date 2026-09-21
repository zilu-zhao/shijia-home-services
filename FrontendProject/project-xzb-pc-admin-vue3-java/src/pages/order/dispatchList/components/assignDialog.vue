<!-- 冻结弹窗 -->
<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="title"
    :width="966"
    :footer="false"
    top="10vh"
    :on-close="onClickCloseBtn"
  >
    <template #body>
      <div class="formBox bg-wt">
        <t-form ref="form" :data="formData" :label-width="70">
          <t-row>
            <t-col class="w-a">
              <t-form-item label="接单状态：" name="name" :label-width="98">
                <t-select
                  v-model="formData.name"
                  class="form-item-content wt-140"
                  type="search"
                  placeholder="请选择"
                  clearable
                />
              </t-form-item>
            </t-col>
            <t-col class="w-a">
              <t-form-item label="服务方：" name="name" :label-width="90">
                <t-select
                  v-model="formData.name"
                  class="form-item-content wt-140"
                  type="search"
                  placeholder="请选择"
                  clearable
                />
              </t-form-item>
            </t-col>
            <t-col class="w-a">
              <t-form-item label="距离：" name="name" :label-width="62">
                <t-input
                  v-model="formData.name"
                  class="form-item-content wt-140"
                  type="search"
                  suffix="公里"
                  placeholder="请输入"
                  clearable
                />
              </t-form-item>
            </t-col>
            <t-col class="w-a">
              <t-form-item label="电话号码：" name="name" :label-width="90">
                <t-input
                  v-model="formData.name"
                  class="form-item-content wt-140"
                  type="search"
                  placeholder="请输入"
                  clearable
                />
              </t-form-item>
            </t-col>
            <t-col class="w-a">
              <t-form-item label="服务人员姓名：" name="name" :label-width="98">
                <t-input
                  v-model="formData.name"
                  class="form-item-content wt-140"
                  type="search"
                  placeholder="请输入"
                  clearable
                />
              </t-form-item>
            </t-col>
            <t-col class="w-a">
              <t-form-item label="企业名称：" name="name" :label-width="90">
                <t-input
                  v-model="formData.name"
                  class="form-item-content wt-282"
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
      <TableList
        :DialogFormData="listData"
        :AssignPagination="pagination"
        @onPageChange="onPageChange"
        @handleSelectChange="handleSelectChange"
        :activeStatus="1"
      ></TableList>
      <div class="op">
        <div class="bt bt-grey btn-submit" @click="onClickCloseBtn">
          <span>取消</span>
        </div>
        <button
          theme="primary"
          type="submit"
          class="bt btn-submit"
          @click="handleSubmit"
        >
          <span>确定</span>
        </button>
      </div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next'
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
  },
  pagination: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const selectedRowKeys = ref([])
// 触发父级事件
const emit: Function = defineEmits(['handleClose', 'fetchData', 'onPageChange'])
const listData = ref([])
// 弹窗
const formVisible = ref(false)
// 表单数据
const formData = ref({
  accountLockReason: '',
  name: ''
})
// 弹窗标题
const title = ref()
const pagination = ref()
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
    listData.value = JSON.parse(JSON.stringify(val))
    if(pagination.value) return
    pagination.value = JSON.parse(JSON.stringify(props.pagination))
  }
)
const onPageChange = (val) => {
  pagination.value.defaultCurrent = val.defaultCurrent
  pagination.value.defaultPageSize = val.defaultPageSize
  emit('onPageChange', val)
}
const handleSearch = () => {
  emit('fetchData', formData)
}
// 列表选中时
const handleSelectChange = (val) => {
  selectedRowKeys.value = val
}
const handleReset = () => {
  formData.value = {
    accountLockReason: '',
    name: ''
  }
}
const handleSubmit = () => {
  if (selectedRowKeys.value.length > 0) {
    MessagePlugin.success('操作成功')
  } else {
    MessagePlugin.error('请选择服务人员')
  }
}
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
  position: relative;
  .baseList {
    padding-top: 0;
    border-radius: 7px;

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
  .op {
    position: absolute;
    display: flex;
    bottom: 24px;
    right: 32px;
  }
}
:deep(.t-table) {
  th {
    padding-left: 10px;
    padding-right: 10px;
  }
  td {
    padding-left: 10px;
    padding-right: 10px;
  }
}
:deep(.t-pagination) {
  justify-content: flex-start;
  .t-pagination__total {
    display: inline-block;
    flex: initial;
    margin-right: 35px;
    color: var(--color-bk1);
  }
}
.formBox {
  padding: 0 30px 25px;
  margin-bottom: 0;
}
.w-a {
  width: auto;
  max-width: none !important;
  float: left;
  .t-form__item {
    position: initial !important;
  }
}
.wt-140 {
  width: 140px;
}
.wt-282 {
  width: 282px;
}
:deep(.t-row--start) {
  display: block;
}
.t-form:not(.t-form-inline) .t-form__item:last-of-type {
  padding: 0 !important;
}
@media screen and (min-width: 1705px) and (max-width: 2051px) {
  .formBox .t-row > div.t-col {
    max-width: none !important;
  }
}
</style>
