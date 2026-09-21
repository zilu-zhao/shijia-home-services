<!-- 基础表格组件 -->
<template>
  <div class="baseList bg-wt min-h">
    <div class="tableBoxs">
      <div class="newBox">
        <!-- tab -->
        <switchBar :data="tableBar" @changeId="changeId"></switchBar>
        <!-- end -->
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
          select-on-row-click
          :selected-row-keys="selectedRowKeys"
          :disable-data-page="pagination.total <= 10"
          :loading="dataLoading"
          :sort="sort"
          showSizeChanger
          :hide-sort-tips="true"
          :show-sort-column-bg-color="true"
          table-layout="fixed"
          :multiple-sort="true"
          table-content-width="100%"
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
                row.updateTime ? formatDateTimeToDateTimeString(new Date(row.updateTime)) : '-'
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
          <template #op2="{ row }">
            <a
              :class="
                row.saleStatus === 2 ? 'text-forbidden font-bt' : 'font-bt'
              "
              @click="handleClickDetail(row)"
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CaretDownSmallIcon } from 'tdesign-icons-vue-next'
import { COLUMNS } from '../constants'
import { formatDateTimeToDateTimeString } from '@/utils/date'
import NoData from '@/components/noData/index.vue'
import switchBar from '@/components/switchBar/switchBar.vue'
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
  'handleSortChange',
  'onPageChange',
  'handleClickDetail',
  'handleSelectChange',
  'changeTab'
])
const selectedRowKeys = ref([])
// 监听器赋值
watch(props, () => {
  dataLoading.value = false
  // 列表
  tableColumns.value = COLUMNS
  data.value = props.listData
  pagination.value = props.pagination
})
const tableColumns = ref([])
// 行key
const rowKey = ref('id')
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

// 点击取消，暂未开发使用
const handleClickDetail = (row: { rowIndex: any }) => {
  emit('handleClickDetail', row)
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
// tab数据
const tableBar = ref([
{
    name: '全部',
    id: null,
    value: undefined
  },
  {
    name: '退款处理中',
    id: '0',
    value: undefined
  },
  {
    name: '退款成功',
    id: '1',
    value: undefined
  },
  {
    name: '退款失败',
    id: '2',
    value: undefined
  },
])
const changeId = (val: number) => {
  emit('changeTab', val)
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
