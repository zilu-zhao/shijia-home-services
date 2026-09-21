<!-- 基础表格组件 -->
<template>
  <div class="baseList bg-wt min-h">
    <div class="tableBoxs">
      <div class="newBox">
        <button class="bt newBoxbutton" @click="handleBuild()">新建</button>
      </div>
      <t-config-provider :global-config="globalLocale">
        <t-table
          :data="data"
          :columns="COLUMNS"
          :row-key="rowKey"
          vertical-align="middle"
          :hover="true"
          :pagination="
            pagination.total <= 10 || !pagination.total ? null : pagination
          "
          :disable-data-page="pagination.total <= 10"
          :selected-row-keys="selectedRowKeys"
          :loading="dataLoading"
          :sort="sort"
          showSizeChanger
          :filter-value="filterValue"
          :hide-sort-tips="true"
          :show-sort-column-bg-color="true"
          table-layout="fixed"
          :multiple-sort="true"
          table-content-width="100%"
          @page-change="onPageChange"
          @sort-change="sortChange"
          @select-change="rehandleSelectChange"
        >
          <!-- 空页面 -->
          <template #empty>
            <NoData></NoData>
          </template>
          <!-- 服务类型图标 -->
          <template #serveTypeIcon="{ row }">
            <div class="headPortrait">
              <img
                :src="row.serveTypeIcon"
                alt=""
                class="tdesign-demo-image-viewer__ui-image--img"
              />
            </div>
          </template>
          <!-- end -->
          <!-- 服务类型图片 -->
          <template #img="{ row }">
            <div class="headPortrait">
              <t-image-viewer :images="[row.img]">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      alt="test"
                      :src="row.img"
                      class="tdesign-demo-image-viewer__ui-image--img"
                    />
                    <div
                      class="tdesign-demo-image-viewer__ui-image--hover"
                      @click="open"
                    >
                      <span><ZoomInIcon size="1.8em" /></span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
          </template>
          <!-- end -->
          <!-- 在表格中添加自定义列 -->
          <template #updateTime="{ row }">
            <div class="updateTime">
              <span>{{ row.updateTime }}</span>
            </div>
          </template>
          <!-- end -->
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op="{ row }">
            <a
              :class="
                row.activeStatus !== 0
                  ? 'text-forbidden btn-dl btn-split-right'
                  : 'btn-dl btn-split-right'
              "
              @click="handleClickDelete(row)"
              >删除</a
            >
            <a
              :class="
                  'font-bt btn-split-right line'
              "
              @click="handleViewServices(row)"
              >查看服务项</a
            >
            <a class="font-bt line"  :class="row.activeStatus === 2 ? 'text-forbidden' : ''" @click="handleEdit(row)">编辑</a>
            <a class="font-bt btn-split-left"  @click="handleDisable(row)">{{
              row.activeStatus === 2 ? '禁用' : '启用'
            }}</a>
          </template>
          <!-- end -->
        </t-table>
      </t-config-provider>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ListBase'
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CaretDownSmallIcon, ZoomInIcon } from 'tdesign-icons-vue-next'
// import { isNumber } from 'lodash'
import { COLUMNS } from '../constants'
import NoData from '@/components/noData/index.vue'
// 接收父组件传递的值
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
  }
})
// 发送事件给父组件
const emit = defineEmits([
  'fetchData',
  'handleEdit',
  'handleBuild',
  'handleClickDelete',
  'handleDisable',
  'onPageChange',
  'handleSortChange'
])
// 监听器赋值
watch(props, () => {
  data.value = props.listData
  pagination.value = props.pagination
  dataLoading.value = false
})
const filterValue = ref({})
// 路由
const router = useRouter()
// 排序
const sort = ref([
  {
    // 按照服务调用次数进行排序
    sortBy: 'sortNum'
  },
  {
    sortBy: 'updateTime'
  }
]) // 排序
const data: any = ref([])
// 选中的行
const pagination: any = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
// 索引
const rowKey = 'index' // 行的key
const globalLocale = ref({
  table: {
    sortIcon: (h) => h && h(CaretDownSmallIcon)
  }
})
// 加载状态
const dataLoading = ref(true)

// 排序
const sortChange = (val) => {
  sort.value = val
  emit('handleSortChange', val)
}
// 选中的行
const selectedRowKeys = ref([1, 2])
const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val
}
// 点击查看详情
const handleDisable = (val) => {
  emit('handleDisable', val)
}
// 打开编辑弹窗
const handleEdit = (val) => {
  emit('handleEdit', val)
}
// 点击删除
const deleteIdx = ref(-1) // 删除的索引
const handleClickDelete = (row: { rowIndex: any }) => {
  emit('handleClickDelete', row)
  deleteIdx.value = row.rowIndex
}
// 点击翻页
const onPageChange = (val) => {
  pagination.value.defaultCurrent = val.current
  pagination.value.defaultPageSize = val.pageSize
  emit('onPageChange', {
    defaultCurrent: val.current,
    defaultPageSize: val.pageSize
  })
}

// 点击新建
const handleBuild = () => {
  emit('handleBuild')
}

// 点击查看服务项
const handleViewServices = (val) => {
  router.push({
    path: 'ServiceList',
    query: {
      id: val.id
    }
  })
}
</script>
<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.baseList {
  .min-h {
    min-height: 674px;
  }
}
.headPortrait {
  display: flex;
  align-items: center;
}
:deep(.t-table__filter-icon) {
  display: none;
}
:deep(.t-table--column-fixed .t-table__cell--fixed-right) {
  width: 157px !important;
}
</style>
