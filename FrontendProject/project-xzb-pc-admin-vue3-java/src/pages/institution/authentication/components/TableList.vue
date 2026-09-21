<!-- 列表页和详情页的表格 -->
<template>
  <div class="baseList bg-wt min-h">
    <div class="tableBoxs">
      <t-config-provider :global-config="globalLocale">
        <t-table
          :data="data"
          :columns="tableCOLUMNS"
          :row-key="rowKey"
          vertical-align="middle"
          :hover="true"
          :pagination="
            pagination
              ? pagination.total <= 10 || (!pagination.total && pagination)
                ? null
                : pagination
              : null
          "
          :disable-data-page="pagination && pagination.total <= 10"
          :selected-row-keys="selectedRowKeys"
          :loading="dataLoading"
          :sort="sort"
          showSizeChanger
          :filter-value="filterValue"
          :hide-sort-tips="true"
          :show-sort-column-bg-color="true"
          table-layout="fixed"
          :multiple-sort="true"
          :maxHeight="height"
          :scroll="scroll"
          table-content-width="100%"
          @page-change="onPageChange"
          @sort-change="sortChange"
          @select-change="rehandleSelectChange"
        >
          <!-- 空页面 -->
          <template #empty>
            <NoData></NoData>
          </template>
          <!-- 序号 -->
          <template #Num="{ rowIndex }">
            <div class="index">
              <span>{{ rowIndex + 1 }}</span>
            </div>
          </template>
          <!-- 服务类型图标 -->
          <template #serveTypeIcon="{ row }">
            <div class="headPortrait" v-if="row.serveItemIcon">
              <img
                :src="row.serveItemIcon"
                alt=""
                class="tdesign-demo-image-viewer__ui-image--img"
              />
            </div>
            <div v-else>-</div>
          </template>
          <!-- end -->
          <!-- 服务类型图片 -->
          <template #businessLicense="{ row }">
            <div class="headPortrait" v-if="row.businessLicense">
              <t-image-viewer :images="[row.businessLicense]">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      alt="test"
                      :src="row.businessLicense"
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
            <div v-else>-</div>
          </template>
          <!-- 描述 -->
          <template #rejectReason="{ row, rowIndex }">
            <div
              class="description"
              :class="rowIndex < 3 ? 'shortDescription' : ''"
            >
              <span>{{ row.rejectReason ? row.rejectReason : '-' }}</span>
              <span
                v-if="
                  row.rejectReason.length > 36 && row.rejectReason.length <= 200
                "
                class="hover"
                >{{ row.rejectReason }}</span
              >
            </div>
          </template>
          <!-- end -->
          <!-- 手机号 -->
          <template #phoneNumber="{ row }">
            <div class="phoneNumber">
              <!-- 手机号做脱敏处理 -->
              <span>
                {{ row.phoneNumber.toString().substring(0, 3) }}
                ****
                {{ row.phoneNumber.toString().substring(7, 4) }}
              </span>
            </div>
          </template>
          <!-- 在表格中添加自定义列 -->
          <template #updateTime="{ row }">
            <div class="updateTime">
              <span>{{ row.updateTime ? row.updateTime :'-' }}</span>
            </div>
          </template>
          <!-- end -->
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op="{ row }">
            <!-- <a
              :class="
                row.saleStatus === 2
                  ? 'text-forbidden font-bt btn-split-right'
                  : 'font-bt btn-split-right'
              "
              @click="handleClickApply(row)"
              >申请记录</a
            > -->
            <a
              class="font-bt btn-split-right"
              :class="row.certificationStatus !== 1 ? 'text-forbidden' : ''"
              @click="handleReject(row)"
              >通过</a
            >
            <a
              class="font-bt line"
              :class="row.certificationStatus !== 1 ? 'text-forbidden' : ''"
              @click="handleClickFreeze(row)"
              >驳回</a
            >
          </template>
          <!-- end -->
        </t-table>
      </t-config-provider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CaretDownSmallIcon, ZoomInIcon } from 'tdesign-icons-vue-next'
import { COLUMNS, Apply_DATA } from '../constants'
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
  },
  isActive: {
    type: Number
  }
})
// 发送事件给父组件
const emit = defineEmits([
  'fetchData',
  'handleSetupContract',
  'handleBuild',
  'handleClickFreeze',
  'handleSortChange',
  'onPageChange',
  'handleClickThaw',
  'handleApply',
  'handleReject'
])
const height = ref('auto') // 表格高度
const scroll = ref(null) // 表格滚动
// 监听器赋值，切换tab
watch(props, () => {
  if (props.isActive == 0) {
    data.value = props.listData
    pagination.value = props.pagination
    pagination.value.current =
      props.pagination.defaultCurrent == 1 ? 1 : props.pagination.defaultCurrent
      pagination.value.pageSize = props.pagination.defaultPageSize == 1 ? 1 : props.pagination.defaultPageSize
    dataLoading.value = false
    tableCOLUMNS.value = []
    height.value = 'auto'
    tableCOLUMNS.value = COLUMNS
    scroll.value = null
  } else {
    height.value = '300'
    pagination.value = undefined
    data.value = props.listData
    dataLoading.value = false
    tableCOLUMNS.value = []
    tableCOLUMNS.value = Apply_DATA
    scroll.value = {
      type: 'virtual',
      isFixedRowHeight: true,
      rowHeight: 64,
      bufferSize: 20,
      threshold: 5
    }
  }
})

// 表头COLUMNS
const tableCOLUMNS = ref()
// 路由
const router = useRouter()
// 排序
const sort = ref([
  {
    // 按照服务调用次数进行排序
    sortBy: 'createTime'
  },
  {
    sortBy: 'auditTime'
  }
]) // 排序
const globalLocale = ref({
  table: {
    sortIcon: (h) => h && h(CaretDownSmallIcon)
  }
}) // 排序图标
const data: any = ref([])
// 选中的行
const pagination: any = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
// 索引
const rowKey = 'index' // 行的key
const filterValue = ref({
  status: ''
}) // 过滤
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
// 点击跳转到详情页
const handleReject = (val) => {
  emit('handleReject', val)
}

// 点击驳回
const handleClickFreeze = (row) => {
  emit('handleClickFreeze', row)
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
</script>
<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.baseList {
  :deep(.t-table td) {
    height: 64px !important;
  }
}
.headPortrait {
  display: flex;
  align-items: center;
}
:deep(.t-table__filter-icon) {
  display: none;
}
</style>
