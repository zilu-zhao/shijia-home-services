<!-- 冻结弹窗 -->
<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="title"
    :width="920"
    :footer="false"
    top="10vh"
    :on-close="onClickCloseBtn"
  >
    <template #body>
      <div class="statistics">
        <div class="card">
          <div class="body">
            <div class="num">{{ receiveData.totalNum }}</div>
            <div class="title">发放数量（张）</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="card">
          <div class="body">
            <div class="num">{{ receiveData.receiveNum }}</div>
            <div class="title">领取数量（张）</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="card">
          <div class="body">
            <div class="num">{{ receiveData.writeOffNum }}</div>
            <div class="title">使用数量（张）</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="card">
          <div class="body">
            <div class="num">
              {{
                ((receiveData.receiveNum / receiveData.totalNum) * 100).toFixed(
                  1
                )
              }}%
            </div>
            <div class="title">发放率</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="card">
          <div class="body">
            <div class="num">
              {{
                (
                  (receiveData.writeOffNum / receiveData.totalNum) *
                  100
                ).toFixed(1)
              }}%
            </div>
            <div class="title">使用率</div>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="tableBox">
        <TableList
          :DialogFormData="listData"
          :AssignPagination="pagination"
          @onPageChange="onPageChange"
          :activeStatus="1"
        ></TableList>
      </div>
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
  },
  pagination: {
    type: Object,
    default: () => {
      return {}
    }
  },
  receiveData: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

// 触发父级事件
const emit: Function = defineEmits(['handleClose', 'onPageChange'])
const listData = ref([])
// 弹窗
const formVisible = ref(false)

// 弹窗标题
const title = ref()
const pagination = ref() // 分页
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
    if (pagination.value) return
    pagination.value = JSON.parse(JSON.stringify(props.pagination))
  }
)
const onPageChange = (val) => {
  pagination.value.defaultCurrent = val.defaultCurrent
  pagination.value.defaultPageSize = val.defaultPageSize
  emit('onPageChange', val)
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
        // background-color: #fff !important;
        border-bottom: none;
        &:first-child {
          border-radius: 8px 0 0 0;
        }
        &:last-child {
          border-radius: 0 8px 0 0;
        }
        &::after {
          position: absolute;
          right: 0;
          // bottom: -10px;
          bottom: 0;
          content: '';
          border: none;
          width: 100%;
          height: 10px;
          // transform: scaleY(-1); // 水平翻转
          // background-image: linear-gradient(
          //   180deg,
          //   #ffffff00 0%,
          //   #6361601a 100%
          // );
          border-bottom: 1px solid #e8e8e8;
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
    padding-left: 24px;
    padding-right: 0;
  }
  td {
    padding-left: 24px;
    padding-right: 0;
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
:deep(.t-row--start) {
  display: block;
}
.t-form:not(.t-form-inline) .t-form__item:last-of-type {
  padding: 0 !important;
}
.statistics {
  padding: 31px 21px;
  display: flex;
  .card {
    width: 20%;
    position: relative;
    .body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .num {
        font-family: PingFangSC-SNaNpxibold;
        font-weight: 600;
        font-size: 30px;
        height: 42px;
        line-height: 42px;
        color: var(--color-bk1);
      }
      .title {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        color: var(--color-bk4);
      }
    }
    .line {
      width: 1px;
      height: 40px;
      background-color: #e0e0e0;
      position: absolute;
      top: 13px;
    }
    &:first-child {
      .line {
        display: none;
      }
    }
  }
}
.tableBox{
  padding: 0 16px 0 21px;
  :deep(.t-table__content){
    padding-right: 9px;
    &::-webkit-scrollbar{
      width: 4px;
      height: 4px;
      border-radius: 2px;
      // background-color: #D8D8D8;
    }
    &::-webkit-scrollbar-thumb{
      background-color: #D8D8D8;
    }
  }
}
</style>
