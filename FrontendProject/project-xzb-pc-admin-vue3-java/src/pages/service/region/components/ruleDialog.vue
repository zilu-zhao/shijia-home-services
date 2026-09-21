<!-- 新增编辑弹窗 -->
<template>
  <t-dialog
    v-model:visible="formVisible"
    header="调度规则说明"
    :width="628"
    :footer="false"
    :on-close="onClickCloseBtn"
  >
    <template #body v-if="formData">
      <div class="body scollHeight" :class="isShowShadow ? 'shadow' : ''">
        (1)周转时间短。通常把周转时间的长短作为评价批处理系统的性能、选择作业调度方式与算法的重要准则之一。所谓周转时间，是指从作业被提交给系统开始，到作业完成为止的这段时间间隔(称为作业周转时间)。它包括四部分时间：作业在外存后备队列上等待(作业)调度的时间，进程在就绪队列上等待进程调度的时间，进程在CPU 上执行的时间，以及进程等待 I/O 操作完成的时间。其中的后三项在一个作业的整个处理过程中可能会发生多次。对每个用户而言，都希望自己作业的周转时间最短。但作为计算机系统的管理者，则总是希望能使平均周转时间最短，这不仅会有效地提高系统资源的利用率，而且还可使大多数用户都感到满意。
        <br /><br />
        (2)响应时间快。常把响应时间的长短用来评价分时系统的性能，这是选择分时系统中进程调度算法的重要准则之一。所谓响应时间，是从用户通过键盘提交一个请求开始，直至系统首次产生响应为止的时间，或者说，直到屏幕上显示出结果为止的一段时间间隔。它包括三部分时间：从键盘输入的请求信息传送到处理机的时间，处理机对请求信息进行处理的时间，以及将所形成的响应信息回送到终端显示器的时间。
        <br /><br />
        (3)截止时间的保证。这是评价实时系统性能的重要指标，因而是选择实时调度算法的重要准则。所谓截止时间，是指某任务必须开始执行的最迟时间，或必须完成的最迟时间。对于严格的实时系统，其调度方式和调度算法必须能保证这一点，否则将可能造成难以预料的后果。
        <br /><br />
        (4) 优先权准则。 在批处理、 分时和实时系统中选择调度算法时，都可遵循优先权准则，以便让某些紧急的作业能得到及时处理。在要求较严格的场合，往往还须选择抢占式调度方式，才能保证紧急作业得到及时处理。
      </div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
const isShowShadow = ref(false)
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
  }
})

// 计算标签确定是否出阴影, 用于判断是否出现滚动条
const ShowShadow = computed(() => {
  // 获取所有类名为 "card" 的元素和类名为 "body" 的元素
  const bodyElement = document.querySelector('.body')
  const cardElements = document.querySelectorAll('.card')

  // 获取类名为 "body" 的元素的最大高度（通过计算得到）
  if (bodyElement && cardElements.length) {
    const bodyMaxHeight = parseInt(
      window.getComputedStyle(bodyElement).maxHeight
    )
    let cardHeight = 0
    // 遍历所有类名为 "card" 的元素，判断它们的高度是否大于类名为 "body" 的元素的最大高度
    cardElements.forEach((cardElement) => {
      cardHeight += cardElement.clientHeight
    })
    return cardHeight > bodyMaxHeight
  }
})

// 表单
const formData = ref()
// 触发父级事件
const emit: Function = defineEmits([
  'handleClose',
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
    isShowShadow.value = ShowShadow.value
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
    .status {
      height: 50px;
      background-image: linear-gradient(269deg, #f75e43 22%, #f74346 72%);
      .tag {
        font-family: PingFangSC-Medium;
        font-weight: 500;
        font-size: 18px;
        color: #ffffff;
        letter-spacing: 0.21px;
        margin-right: 10px;
      }
      .content {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0.16px;
      }
    }
    .shadow {
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 10px;
        pointer-events: none;
        bottom: 72px;
        background: linear-gradient(to top, #6361601a, transparent);
      }
    }
    .body {
      padding: 0 20px;
      padding-right: 5px;
      margin-right: 6px;
      margin-top: 20px;
      margin-bottom: 20px;
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
        .leftBox {
          width: 57px;
          height: 20px;
          font-family: PingFangSC-SNaNpxibold;
          font-weight: 600;
          font-size: 14px;
          color: #191919;
          letter-spacing: 0.16px;
          margin-right: 48px;
          flex-shrink: 0;
        }
        .rightBox {
          width: 100%;
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
            .serviceBox {
              display: flex;
              width: 100%;
              .itemBox {
                .imgBox {
                  display: flex;
                }
                .time {
                  font-size: 14px;
                  color: #999999;
                }
              }
            }
            .label {
              width: 70px;
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
    .scollHeight {
      max-height: 540px;
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
