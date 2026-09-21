<!-- 基础表格组件 -->
<template>
  <div class="baseList bg-wt min-h">
    <div class="tableBoxs">
      <t-config-provider :global-config="globalLocale">
        <t-table
          :data="data"
          :columns="tableColumns"
          :row-key="rowKey"
          vertical-align="middle"
          :hover="true"
          :pagination="
            pagination.total <= 10 || !pagination.total ? null : pagination
          "
          select-on-row-click
          :selected-row-keys="selectedRowKeys"
          :disable-data-page="pagination.total <= 10"
          :loading="dataLoading"
          :sort="sort"
          :maxHeight="height"
          showSizeChanger
          :hide-sort-tips="true"
          :show-sort-column-bg-color="true"
          table-layout="fixed"
          :multiple-sort="true"
          table-content-width="100%"
          @select-change="rehandleSelectChange"
          @page-change="onPageChange"
          @sort-change="sortChange"
        >
          <!-- 空页面 -->
          <template #empty>
            <NoData></NoData>
          </template>
          <!-- 在表格中添加自定义列 -->
          <template #updateTime="{ row }">
            <div class="updateTime">
              <span>{{
                formatDateTimeToDateTimeString(new Date(row.updateTime))
              }}</span
              >
              <!-- <span class="linjin"></span> -->
            </div>
          </template>
          <!-- end -->
          <!-- 电话号 -->
          <template #contactsPhone="{ row }">
            <span>
              {{
                row.contactsPhone.slice(0, 4) +
                ' ' +
                row.contactsPhone.slice(4, 7) +
                ' ' +
                row.contactsPhone.slice(7, 11)
              }}
            </span></template
          >
          <!-- end -->
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op="{ row }">
            <a
              :class="
                row.saleStatus === 2
                  ? 'text-forbidden font-bt btn-split-right'
                  : 'font-bt btn-split-right'
              "
              @click="handleClickAssign(row)"
              >指派</a
            >
            <a
              :class="
                row.ordersStatus === 700
                  ? 'text-forbidden font-bt line'
                  : 'font-bt line'
              "
              @click="handleClickRefund(row)"
              >退款</a
            >
            <a class="font-bt btn-split-left" @click="handleDetail(row)"
              >查看</a
            >
          </template>
          <!-- end -->
          <template #op2="{ row }">
            <a
              :class="
                row.saleStatus === 2 ? 'text-forbidden font-bt' : 'font-bt'
              "
              @click="handleClickAssign(row)"
              >查看</a
            >
          </template>
          <!-- end -->
          <template #serveAddress="{ row }">
            <div class="description">
              <span>{{ row.serveAddress }}</span>
              <span v-if="row.serveAddress.length > 36" class="hover">{{
                row.serveAddress
              }}</span>
            </div>
          </template>
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
import { CaretDownSmallIcon } from 'tdesign-icons-vue-next'
import { COLUMNS, PERSON_COLUMNS } from '../constants'
import { formatDateTimeToDateTimeString } from '@/utils/date'
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
  DialogFormData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  AssignPagination: {
    type: Object,
    default: () => {
      return {}
    }
  },
  activeStatus: {}
})
// 发送事件给父组件
const emit = defineEmits([
  'fetchData',
  'handleBuild',
  'handleClickCancel',
  'handleSortChange',
  'onPageChange',
  'handleClickRefund',
  'handleClickAssign',
  'handleSelectChange'
])
const selectedRowKeys = ref([])
const height = ref('auto')
// 监听器赋值
watch(props, () => {
  dataLoading.value = false
  // 弹窗里面的列表
  if (props.activeStatus == 1) {
    tableColumns.value = PERSON_COLUMNS
    data.value = props.DialogFormData
    pagination.value = props.AssignPagination
    height.value = '335'
  } else {
    // 列表
    tableColumns.value = COLUMNS
    data.value = props.listData
    pagination.value = props.pagination
    height.value = 'auto'
  }
})
const tableColumns = ref([])
// 行key
const rowKey = ref('id')
// 路由
const router = useRouter()
// 排序
const sort = ref([
  {
    sortBy: 'updateTime'
  }
]) // 排序
const globalLocale = ref({
  table: {
    sortIcon: (h) => h && h(CaretDownSmallIcon)
  }
}) // 排序图标
const data: any = ref([])
// 分页器
const pagination: any = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
// 加载状态
const dataLoading = ref(true)

// 排序
const sortChange = (val) => {
  sort.value = val
  emit('handleSortChange', val)
}

// 点击退款
const handleClickRefund = (val) => {
  emit('handleClickRefund', val)
}

// 查看详情
const handleDetail = (val) => {
  router.push('/order/orderList/orderDetail/' + val.id)
}
// 点击取消，暂未开发使用
const handleClickCancel = (row: { rowIndex: any }) => {
  emit('handleClickCancel', row)
}
const handleClickAssign = (row: { rowIndex: any }) => {
  emit('handleClickAssign', row)
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
// 选中的行
const rehandleSelectChange = (value, { selectedRowData }) => {
  selectedRowKeys.value = value
  emit('handleSelectChange', value)
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
.updateTime {
  display: flex;
  align-items: center;
  .linjin {
    margin-left: 6px;
    width: 17px;
    height: 17px;
    background-image: url('@/assets/icon_linjin@2x.png');
    background-size: 100% 100%;
  }
}
</style>
