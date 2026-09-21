<!-- 详情弹窗 -->
<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="title"
    :width="640"
    :footer="false"
    :on-close="onClickCloseBtn"
  >
    <template #body v-if="formData">
      <div class="body">
        <!-- 客户信息 -->
        <div class="card">
          <div class="lineBox">
            <div class="left">
              <div class="tag">
                <span class="label">退款编号</span>
                <span class="item">123</span>
              </div>
              <div class="tag">
                <span class="label">订单编号</span>
                <span class="item">123</span>
              </div>
              <div class="tag">
                <span class="label">订单状态</span>
                <span class="item">123</span>
              </div>
              <div class="tag">
                <span class="label">退款状态</span>
                <span class="item">123</span>
              </div>
              <div class="tag">
                <span class="label">申请人</span>
                <span class="item">123</span>
              </div>
              <div class="tag">
                <span class="label">申请时间</span>
                <span class="item">2029-10-31  23:30</span>
              </div>
            </div>
            <div class="right">
              <div class="tag">
                <span class="label">退款原因</span>
                <span class="item">123</span>
              </div>
              <div class="tag">
                <span class="label">退款渠道</span>
                <span class="item">123</span>
              </div>
              <div class="tag">
                <span class="label">退款方式</span>
                <span class="item">微信</span>
              </div>
              <div class="tag">
                <span class="label">退款时间</span>
                <span class="item">123</span>
              </div>
              <div class="tag">
                <span class="label">退款金额</span>
                <span class="item">123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ZoomInIcon } from 'tdesign-icons-vue-next'
import { formatDateTimeToDateTimeString } from '@/utils/date'
import { UNIT } from '@/constants'
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
  title:{
    type: String,
    default: '查看退款记录'
  }
})

// 表单
const formData = ref()
// 触发父级事件
const emit: Function = defineEmits([
  'handleClose',
  'fetchData',
  'handleClickCancel',
  'handleClickPeople',
  'handleClickRefund'
])
// 弹窗
const formVisible = ref(false)
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
    formData.value = props.data
  }
)
</script>
<style lang="less" scoped>
:deep(.t-dialog) {
  border: none;
  .t-dialog__body {
    padding: 0;
    .pd {
      padding: 12px 32px;
    }
    .body {
      padding: 0 32px;
      padding-right: 22px;
      margin-right: 10px;
      margin-top: 32px;
      margin-bottom: 32px;
      max-height: 454px;
      overflow-y: scroll;
      scroll-behavior: smooth;
      // 滚动条不占位置
      &::-webkit-scrollbar {
        width: 4px;
        // 滚动条左移10px
        margin-left: -10px;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent; /* 设置滚动条轨道背景色 */
      }
      &::-webkit-scrollbar-thumb {
        width: 4px;
        background-color: #d8d8d8; /* 设置滚动条滑块颜色 */
        border-radius: 2px; /* 设置滚动条滑块的圆角 */
        &:hover {
          background-color: #555; /* 设置滑块的背景色 */
        }
      }
      .card {
        padding: 20px 0;
        background: #ffffff;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }
        .lineBox {
          width: 100%;
          display: flex;
          margin-bottom: 11px;
          &:last-child {
            margin-bottom: 0;
          }
          .left,
          .right {
            width: 50%;
          }
          .left {
            border-right: 1px solid #e8e8e8;
          }
          .right {
            margin-left: 31.5px;
          }
          .tag {
            margin-bottom: 30px;
            &:nth-child(6){
              margin-bottom: 0;
            }
            .label {
              width: 56px;
              display: inline-block;
              height: 20px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              font-size: 14px;
              color: #595959;
              letter-spacing: 0;
              text-align: justify;
              margin-right: 20px;
            }
            .item {
              font-family: PingFangSC-Regular;
              font-weight: 400;
              font-size: 14px;
              color: #191919;
              letter-spacing: 0.16px;
            }
          }
        }
      }
    }
    .footBox {
      padding: 20px 32px;
      display: flex;
      justify-content: flex-end;
      .bt {
        width: 80px;
        height: 32px;
        margin-right: 15.5px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
:deep(.tdesign-demo-image-viewer__ui-image) {
  width: 78.7px;
  height: 78.7px;
  max-width: 78.7px;
  max-height: 78.7px;
  margin-right: 10.5px;
}
:deep(.tdesign-demo-image-viewer__ui-image--img) {
  width: 78.7px;
  height: 78.7px;
  max-width: 78.7px;
  max-height: 78.7px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-5 {
  margin-bottom: 5px;
}
:deep(.t-form:not(.t-form-inline) .t-form__item:last-of-type) {
  position: relative;
  right: -155px;
}
.grey {
  background-image: linear-gradient(
    269deg,
    #d6d6d6 22%,
    #ebebeb 72%
  ) !important;
}
</style>
