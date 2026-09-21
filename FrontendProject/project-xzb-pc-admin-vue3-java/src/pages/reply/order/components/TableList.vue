<!-- 基础表格组件 -->
<template>
  <div class="baseList">
    <div class="tableBoxs">
      <div class="newBox">
        <!-- end -->
        <!-- 批量回复功能暂时隐藏，后续是否添加不确定 -->
        <!-- <div class="bt newBoxbutton" @click="handleBuild()">批量回复</div> -->
      </div>
      <!-- 表格 -->
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="data.id"
        vertical-align="middle"
        :hover="true"
        :pagination="
          pagination.total <= 10 || !pagination.total ? null : pagination
        "
        :disable-data-page="pagination.total <= 10"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :column-controller="{
          hideTriggerButton: true
        }"
        :sort="sort"
        :hide-sort-tips="true"
        :show-sort-column-bg-color="true"
        table-layout="fixed"
        table-content-width="100%"
        @filter-change="FilterChange"
        @sort-change="sortChange"
        @select-change="rehandleSelectChange"
        @page-change="onPageChange"
      >
        <!-- 空页面 -->
        <template #empty>
          <NoData></NoData>
        </template>
        <!-- end -->
        <!-- 评价昵称 -->
        <template #name="{ row }">
          <div class="name">
            <span>{{ row.evaluatorInfo.name }}</span>
          </div>
        </template>
        <!-- end -->
        <!-- 评价内容-->
        <template #content="{ row }">
          <!-- 当当前页的数量大于4时，显示 -->
          <!-- v-if="
              pagination.total -
                (pagination.defaultCurrent - 1) * pagination.defaultPageSize >
              4
            " -->
          <div class="description">
            <span v-html="handleEmoji(row.content)"></span>
            <span
              v-if="row.content.length > 36"
              class="hover"
              v-html="handleEmoji(row.content)"
            ></span>
          </div>
        </template>
        <!-- 评价对象 -->
        <template #targetName="{ row }">
          <div class="name">
            <a class="font-bt" @click="handleClickObject(row)">{{
              row.targetName
            }}</a>
          </div>
        </template>
        <!-- 添加图片 -->
        <template #picture="{ row }">
          <div class="name">
            <span>
              <div v-if="row.pictureArray">
                <t-image-viewer
                  v-if="row.pictureArray.length > 0"
                  :images="row.pictureArray"
                >
                  <template #trigger="{ open }">
                    <div class="tdesign-demo-image-viewer__ui-image">
                      <img
                        alt="test"
                        :src="row.pictureArray[0]"
                        class="tdesign-demo-image-viewer__ui-image--img"
                      />
                      <div
                        class="tdesign-demo-image-viewer__ui-image--hover"
                        @click="open"
                      ></div>
                    </div>
                  </template>
                </t-image-viewer>
              </div>
            </span>
          </div>
        </template>
        <!-- 评分加分 -->
        <template #score_array="{ row }">
          <div v-if="row.totalScore" class="name">{{ row.totalScore }}分</div>
        </template>
        <!-- 在操作栏添加删除、编辑、查看三种操作 -->
        <template #op="{ row }">
          <a
            :class="
               'btn-dl line btn-split-right text-forbidden'
            "
            @click="handleClickDelete(row)"
            >删除</a
          >
          <a class="font-bt" @click="handleClickDetail(row)"
            >详情</a
          >
        </template>
        <!-- end -->
      </t-table>
      <!-- end -->
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ListBase'
}
</script>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { COLUMNS } from '../constants'
import NoData from '@/components/noData/index.vue'
import { ImgList } from '@/utils/emoji/index'

import { dataType, paginationType } from '../type'

const props = defineProps({
  listData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  pagination: {
    type: Object,
    default: () => {
      return {}
    }
  },
  replyType: {
    type: String,
    default: '0'
  },
  dataLoading: {
    type: Boolean,
    default: false
  }
})
// 触发父组件
const emit = defineEmits([
  'fetchData',
  'handleSetupContract',
  'handleBuild',
  'handleClickDelete',
  'getActiveId',
  'handleClickSetTop',
  'handlePageChange'
])

// 路由
const router = useRouter()
const sort = ref({
  // 按照服务调用次数进行排序
  sortBy: 'serviceCallNumber'
}) // 排序
const data = ref<dataType>([])
const pagination = ref<paginationType>({})

// emoji
const handleEmoji = (content) => {
  if (!content) return content
  let newContent = content
  const regex = /\[([\u4e00-\u9fa5]+)\]/g
  const match = newContent.match(regex)
  // 符合正则 则将对应的表情的特定字符转为图片
  if (regex.test(newContent)) {
    match.forEach((item) => {
      const arr = ImgList.filter((item1) => item1.id === item)
      if (arr.length) {
        newContent = newContent.replace(
          item,
          `<img data-v-1fd959d1="" width="20" height="20" src="${
            ImgList.filter((item1) => item1.id === item)[0].src
          }" alt="" class="emoji-icon" style="vertical-align: text-top;">`
        )
      }
    })
  }
  return newContent
}


// 加载状态
// 排序
const sortChange = (val) => {
  // 将排序的结果赋值给sort
  sort.value = val
  // 调用onFilterChange方法进行排序
  onFilterChange(val)
}
// 排序
const onFilterChange = (val) => {
  emit('fetchData', val)
}
// 筛选
const FilterChange = (val) => {
  ONFilterChange(val)
}
// 筛选
const ONFilterChange = (val) => {
  emit('fetchData', val)
}

// 选中的行
const selectedRowKeys = ref([])
const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val

  emit('getActiveId', val)
}
// 点击查看详情
const handleClickDetail = (val) => {
  router.push(`order/detail/${val.id}/${props.replyType}`)
}
// 点击评价对象
const handleClickObject = (val) => {
  router.push(`order/objectDetail/${val.targetId}/${props.replyType}`)
  localStorage.setItem('objectDetailTitle', val.targetName)
}
// 打开编辑弹窗
const handleSetupContract = (val) => {
  emit('handleSetupContract', val)
}
// 点击删除
const handleClickDelete = (row) => {
  emit('handleClickDelete', row)
}
// 翻页重新请求数据
const onPageChange = (val) => {
  pagination.value.defaultCurrent = val.current
  emit('handlePageChange', {
    defaultCurrent: val.current,
    defaultPageSize: val.pageSize
  })
}
// 点击新建中，暂时不用，先注释，后续可能会用到
// const handleBuild = () => {
//   emit('handleBuild')
// }

// 控制弹窗
// 监听更新赋值
watchEffect(() => {
  if (!props.listData) {
    data.value = []
    pagination.value = {}
  } else {
    data.value = props.listData
    pagination.value = props.pagination
  }
})
</script>
<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.newBox {
  margin-bottom: 16px;
  display: flex;
  .newBoxbutton {
    // 右对齐
    margin-left: auto;
    width: 88px;
    height: 32px;
    // 下对齐
    margin-bottom: auto;
    margin-top: auto;
  }
}

.baseList {
  :deep(.t-table td) {
    height: 64px !important;
  }
}
</style>
