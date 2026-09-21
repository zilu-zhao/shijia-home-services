<template>
  <div>
    <t-dialog
      :preventScrollThrough="false"
      :header="false"
      :footer="false"
      @close="onOverlayClick"
      :on-overlay-click="onOverlayClick"
      v-model:visible="visible"
    >
      <div class="headBox">{{ data?.title }}</div>
      <div class="Box">
        <div class="bodyBox">
          <img :src="data?.img" alt="" class="img" />
          <div class="titleBox">
            <div class="leftBox">
              <div class="name">{{ data?.title }}</div>
              <div class="red">
                ￥<span>{{ data?.price }}</span
                >/{{ UNIT[data?.unit]?.label }}
              </div>
            </div>
            <img src="@/assets/test-img/cutter@2x.png" alt="" />
          </div>
          <img :src="data?.detailImg" alt="" class="img" />
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { UNIT } from '@/constants'

const props = defineProps({
  previewData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  previewVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['handleClose'])
const visible = ref(false)
const data = ref()
const onOverlayClick = () => {
  emit('handleClose')
}
watch(props, () => {
  visible.value = props.previewVisible
  data.value = props.previewData
})
</script>

<style lang="less" scoped>
:deep(.t-dialog__header) {
  position: absolute;
  top: 30px;
  right: 30px;
  height: auto;
  background: transparent;
  padding: 0;
  .t-dialog__close svg {
    color: var(--color-bk4);
  }
}
:deep(.t-dialog__body) {
  background-color: transparent;
  padding: 51.4px 22px 21px;
  width: 318px;
  height: 634px;
  background-image: url('@/assets/test-img/img_mobile@2x.png');
  background-size: 100% 100%;
  // 滚动条隐藏
  &::-webkit-scrollbar {
    display: none;
  }
  .headBox {
    background-color: #fff;
    width: 274.5px;
    height: 35px;
    line-height: 35px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 13px;
    color: #0f0f0f;
    text-align: center;
  }
  .Box {
    height: 529px;
    overflow: auto;
    border-bottom-right-radius: 26px;
    border-bottom-left-radius: 26px;
    &::-webkit-scrollbar {
      display: none;
    }
    .bodyBox {
      background-color: #f8f8f8;
      .img {
        width: 274.5px;
        height: auto;
        border-radius: 0;
        margin-right: 0;
      }
      .titleBox {
        width: 274.5px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: var(--color-bk1);
        font-size: 14px;
        padding: 16px 15px 20px;
        box-sizing: border-box;
        background-color: #fff;
        margin-top: -6px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .leftBox {
          div {
            height: auto;
            line-height: 20px;
          }
          .name {
            font-family: PingFangSC-Medium;
            font-weight: 500;
            font-size: 14px;
          }
          .red {
            margin-top: 4px;
            font-size: 12px;
            color: #ff4d4f;
            font-weight: bold;
            span{
              font-size: 18px;
            }
          }
        }
        img {
          width: 83px;
          height: 27px;
        }
      }
    }
  }
}
:deep(.t-dialog) {
  width: auto;
  border: none;
  background: transparent;
  position: initial;
}
:deep(.t-dialog__ctx .t-dialog__position.t-dialog--top) {
  padding-top: 10vh;
}
:deep(.t-dialog__ctx .t-dialog__mask) {
  background-color: #ffffffcc;
  backdrop-filter: blur(2px);
}
</style>
