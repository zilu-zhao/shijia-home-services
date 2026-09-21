<!-- 基础表格组件 -->
<template>
  <div class="baseList bg-wt min-h">
    <div class="tableBoxs">
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
          <template #serveStartTime="{ row }">
            <div class="updateTime">
              <span>{{ row.serveStartTime ? formatDateTimeToDateTimeString(new Date(row.serveStartTime)) : '-' }}</span>
            </div>
          </template>
          <!-- end -->
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op="{ row }">
            <a
              :class="
                row.ordersStatus === 700 || row.payStatus === 2
                  ? 'text-forbidden font-bt btn-split-right'
                  : 'font-bt btn-split-right'
              "
              @click="handleClickRefund(row)"
              >退款</a
            >
            <a
              class="font-bt btn-split-left"
              @click="handleDetail(row)"
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
import { COLUMNS } from '../constants'
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
  }
})
// 发送事件给父组件
const emit = defineEmits([
  'handleSortChange',
  'onPageChange',
  'handleClickRefund'
])
// 监听器赋值
watch(props, () => {
  data.value = props.listData
  pagination.value = props.pagination
  pagination.value.current = props.pagination.defaultCurrent == 1 ? 1 : props.pagination.defaultCurrent
  pagination.value.pageSize = props.pagination.defaultPageSize
  dataLoading.value = false
})
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
// 排列数据
const data: any = ref([])
// 分页器
const pagination: any = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1, // 默认当前页
  pageSize: 10,
  current: 1
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
// 点击翻页
const onPageChange = (val) => {
  pagination.value.defaultCurrent = val.current
  pagination.value.current = val.current
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
.updateTime{
  display: flex;
  align-items: center;
  .linjin{
    margin-left: 6px;
    width: 17px;
    height: 17px;
    background-image: url('@/assets/icon_linjin@2x.png');
    background-size: 100% 100%;
  }
}
:deep(.t-table--column-fixed ){
  .t-table__header{
    .t-table__cell--fixed-right{
      padding-left: 20px;
      text-align: left;
    }
  }
  .t-table__cell--fixed-right{
      text-align: right;
    }
}
</style>
