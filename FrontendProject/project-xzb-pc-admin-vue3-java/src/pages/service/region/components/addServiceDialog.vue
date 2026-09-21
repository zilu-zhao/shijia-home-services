<!-- 设置服务弹窗-->
<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="title"
    :width="791"
    :on-close="onClickCloseBtn"
  >
    <template #body>
      <div class="leftBox">
        <img
          src="@/assets/icon_team_guanbi.png"
          alt=""
          class="shanghua"
          @click="scollTop"
          v-if="currentPage > 1 && typeItems.length > 9"
        />
        <div class="tagBox">
          <div
            v-for="(item, index) in typeItem"
            :key="index"
            :class="activeId === item.id ? 'activeTypeTag typeTag' : 'typeTag'"
            @click="handleSwitchTab(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <img
          src="@/assets/icon_team_guanbi2.png"
          alt=""
          class="xiahua"
          @click="scollBottom"
          v-if="currentPage * 9 < typeItems.length && typeItems.length > 9"
        />
      </div>
      <div class="middleBox">
        <t-input
          class="search"
          placeholder="请输入服务关键字"
          v-model="searchKeyword"
          @change="handleSearch"
        >
          <template #suffixIcon>
            <search-icon />
          </template>
        </t-input>
        <NoData v-if="filteredItems?.length === 0"></NoData>
        <ul class="serviceBox" v-if="filteredItems?.length > 0">
          <li v-for="item in filteredItems" :key="item.id" class="serviceTag">
            <t-checkbox
              @change="(e) => onChange(e, item)"
              v-model="item.checked"
              :disabled="item.disabled"
            >
              {{ item.name }}
            </t-checkbox>
            <span>￥{{ item.referencePrice }}</span>
          </li>
        </ul>
      </div>
      <div class="rightBox">
        <div class="title">已选服务（{{ activeItems.length }}）</div>
        <NoData v-if="activeItems.length === 0"></NoData>
        <div class="cardBox" v-if="activeItems.length > 0">
          <div class="card" v-for="(item, index) in activeItems" :key="index">
            <span>{{ item.name }}</span>
            <img
              src="@/assets/btn_clean.png"
              alt=""
              @click="removeCard(item)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="bt bt-grey btn-submit" @click="onClickCloseBtn">
        <span>取消</span>
      </div>
      <div type="submit" class="bt btn-submit" @click="handleSubmit">
        <span>添加</span>
      </div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { SearchIcon } from 'tdesign-icons-vue-next'
import NoData from '@/components/noData/index.vue'
import { forEach } from 'lodash'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  serviceTypeData: {
    type: Array,
    default: () => []
  },
  serviceItemData: {
    type: Array,
    default: () => []
  },
  listData: {
    type: Array,
    default: () => []
  }
})
let typeItems = []
const typeItem = ref([])
const items = ref({})
// 服务类型当前页
const currentPage = ref(1)
// 选中的类型Id
const activeId = ref()
const searchKeyword = ref('') // 搜索关键字
const twoData = ref([]) // 去除重复项中转数组
const activeItems = ref([]) // 已选服务
const originData = ref([]) // 原始数据
const filteredItems = ref([])

// 触发父级事件
const emit: Function = defineEmits([
  'handleClose',
  'handleServiceTypeChange',
  'handleSubmit'
])
// 弹窗
const formVisible = ref(false)
// 弹窗标题
const title = ref('添加服务')

// 点击取消关闭
const onClickCloseBtn = () => {
  // 重置表单
  formVisible.value = false
  // 清空表单数据
  activeItems.value = []
  // 清空搜索框数据
  searchKeyword.value = ''
  filteredItems.value.forEach((item) => {
    item.checked = false
  })
  filteredItems.value = []
  emit('handleClose')
}
// 点击叉号关闭
// 切换选中类型
const handleSwitchTab = (id) => {
  activeId.value = id
  // 清空输入框
  searchKeyword.value = ''
  emit('handleServiceTypeChange', id)
}
// 选择服务，把内容添加到activeItems，已选择的服务
const onChange = (e, val) => {
  if (e === true) {
    activeItems.value.push(val)
  } else {
    activeItems.value = activeItems.value.filter((item) => item.id !== val.id)
  }
}
// 输入字符模糊搜索
const handleSearch = () => {
  filteredItems.value = items.value[activeId.value].filter((item) => {
    return item.name.includes(searchKeyword.value) //includes() 方法用于判断字符串是否包含指定的子字符串。
  })
}
// 清除已选服务
const removeCard = (item) => {
  activeItems.value = activeItems.value.filter((i) => i.id !== item.id)
  // 将filteredItems中的checked属性重置为false
  filteredItems.value.forEach((i) => {
    if (i.id === item.id) {
      i.checked = false
    }
  })
  if (filteredItems.value.length === 0) {
    items.value[activeId.value].forEach((i) => {
      if (i.id === item.id) {
        i.checked = false
      }
    })
  }
}
// 点击向上滚动
const scollTop = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
    typeItem.value = typeItems.slice(
      (currentPage.value - 1) * 9,
      currentPage.value * 9
    )
  }
}
// 点击向下滚动
const scollBottom = () => {
  if (currentPage.value < Math.ceil(typeItems.length / 9)) {
    currentPage.value += 1
    typeItem.value = typeItems.slice(
      (currentPage.value - 1) * 9,
      currentPage.value * 9
    )
  }
}
// 提交
const handleSubmit = () => {
  if (activeItems.value.length === 0) {
    MessagePlugin.warning('请选择服务')
    return
  } else {
    emit('handleSubmit', activeItems.value)
  }
}
// 监听获取服务项新的数据
watch(
  () => props.serviceItemData,
  () => {
    items.value[activeId.value] = props.serviceItemData
    filteredItems.value = items.value[activeId.value]
    // activeItems.value与filteredItems.value进行比对，如果filteredItems.value中的某一项在activeItems.value中存在，则将该项的checked属性设置为true
    filteredItems.value.forEach((item) => {
      originData.value.forEach((i) => {
        if (item.id === i.id) {
          item.checked = true
          item.disabled = true
        }
      })
      activeItems.value.forEach((i) => {
        if (item.id === i.id) {
          item.checked = true
        }
      })
    })
  }
)
// 监听器，监听父级传递的visible值，控制弹窗显示隐藏
watch(
  () => props.visible,
  () => {
    typeItems = props.serviceTypeData
    activeId.value = typeItems[0].id
    twoData.value = props.listData
    forEach(props.listData, (item, i) => {
      originData.value.push(item)
      originData.value[i].name = originData.value[i].serveItemName
      originData.value[i].id = originData.value[i].serveItemId
    })
    // 如果项数大于传入值的项数，说明有重复项,只保留其中的前半部分
    if (originData.value.length > props.listData.length) {
      originData.value = originData.value.slice(0, props.listData.length)
    }
    // 如果items中没有activeId对应的数据，则将activeId对应的数据添加到items中
    if (!items.value[activeId.value]) {
      items.value[activeId.value] = props.serviceItemData
      filteredItems.value = items.value[activeId.value]
    }
    typeItem.value = typeItems.slice(0, 9)
    formVisible.value = props.visible
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
.leftBox {
  position: relative;
  .shanghua {
    width: 14px;
    position: absolute;
    left: 29px;
    top: 18px;
    cursor: pointer;
  }
  .xiahua {
    width: 14px;
    position: absolute;
    left: 29px;
    bottom: 18px;
    cursor: pointer;
  }
  .tagBox {
    margin: 25px 0;
    height: 302px;
    border-right: 2px solid #e4e7ed;
    // 禁止滚动

    &::-webkit-scrollbar {
      width: 0;
    }

    .typeTag {
      margin-right: 18px;
      padding-top: 10px;
      color: var(--color-bk1);
      font-weight: 500;
      letter-spacing: 0.16px;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      width: 71px;
    }
    .activeTypeTag {
      color: var(--color-main);
      position: relative;
      // 伪类
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: 2px;
        height: 100%;
        right: -20px;
        top: 0;
        background-color: var(--color-main);
      }
    }
  }
}
.middleBox {
  padding: 25px 32px 25px;
  width: 315px;
  border-right: 1px solid #e4e7ed;
  :deep(.noData) {
    margin: 0 auto;
  }
  .search {
    width: 240px;
    height: 32px;
  }
  .serviceBox {
    height: 252px;
    width: 250px;
    margin-top: 18.4px;
    overflow-y: scroll;
    scroll-behavior: smooth;
    // 滚动条不占位置
    &::-webkit-scrollbar {
      width: 4px;
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
    .serviceTag {
      width: 240px;
      height: 50px;
      border: 1px solid #ebeef5;
      border-top: none;
      display: flex;
      padding-left: 14px;
      padding-right: 26px;
      align-items: center;
      justify-content: space-between;
      span {
        color: var(--color-bk3);
        font-size: 13px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
      }
      // :deep(.t-checkbox__input) {
      //   width: 14px;
      //   height: 14px;
      //   border: 1px solid #d5d8de;
      //   border-radius: 2px;
      //   background-color: #ffffff;
      // }
      :deep(.t-checkbox__label) {
        margin-left: 9px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 13px;
        color: var(--color-bk1);
        letter-spacing: 0;
        line-height: 14px;
      }
      &:first-child {
        border-top: 1px solid #ebeef5;
      }
    }
  }
}
.rightBox {
  padding-top: 24.5px;

  width: 328.5px;
  :deep(.noData) {
    width: 291.5px;
    margin-left: 37px;
  }
  .title {
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 14px;
    padding-left: 29.5px;
    color: var(--color-bk1);
    letter-spacing: 0.16px;
    height: 34px;
  }
  .cardBox {
    width: 303px;
    height: 278px;
    padding-left: 29.5px;
    padding-top: 5px;
    display: flex;
    box-sizing: content-box;
    flex-wrap: wrap;
    overflow-y: auto;
    scroll-behavior: smooth;
    align-content: flex-start;
    // 滚动条不占位置
    &::-webkit-scrollbar {
      width: 4px;
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
    // 一行显示两个
    .card {
      padding-left: 13px;
      padding-right: 13px;
      width: 133px;
      height: 40px;
      background: #ffffff;
      box-shadow: 0 1px 4px 3px #00000008;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 22px;
      margin-bottom: 15px;
      &:nth-child(2n) {
        margin-right: 0;
      }
      span {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        line-height: 14px;
        color: var(--color-bk1);
      }
      img {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
  }
}
:deep(.t-textarea__limit) {
  color: var(--color-bk4);
  right: 10px;
}
:deep(.t-dialog__footer) {
  display: flex;
  justify-content: flex-end;
  padding: 22px 32px 24px;
}
:deep(.t-dialog__body) {
  border-bottom: 1px solid #e4e7ed;
  padding: 0 37px 0 17.5px;
  display: flex;
}
:deep(.noData img) {
  width: 157.3px;
  height: 143px;
  margin-top: 55.5px;
  margin-bottom: 9px;
}
:deep(.noData p) {
  margin-bottom: 9px;
}
:deep(.t-checkbox.t-is-disabled.t-is-checked .t-checkbox__input){
  background-color: var(--td-bg-color-component-disabled);
}
</style>
