<!-- 优惠券列表和领取记录列表 -->
<template>
  <div class="baseList bg-wt min-h">
    <div class="tableBoxs">
      <div class="newBox">
        <button class="bt newBoxbutton" @click="handleBuild" v-if="activeStatus !== 1">新增优惠券</button>
      </div>
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
          @page-change="onPageChange"
          @sort-change="sortChange"
        >
          <!-- 空页面 -->
          <template #empty>
            <NoData :PhotoMt="props.activeStatus == 1 ? 0 : 60" :PhotoMb="props.activeStatus == 1 ? 0 : 30" :pMb="props.activeStatus == 1 ? 50 : 75" :content="'暂无领取记录哦~'"></NoData>
          </template>
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op="{ row }">
            <a
              :class="
                row.status === 3 || row.status === 4
                  ? 'text-forbidden font-bt btn-split-right'
                  : 'font-bt btn-split-right'
              "
              @click="handleClickCancel(row)"
              >撤销</a
            >
            <a
              :class="
                row.status !== 1
                  ? 'text-forbidden font-bt line'
                  : 'font-bt line'
              "
              @click="handleDetail(row)"
              >编辑</a
            >
            <a class="font-bt btn-split-left" @click="handleClickAssign(row)"
              >领取记录</a
            >
          </template>
          <!-- end -->
          <!-- 地址添加文字过多悬浮hover -->
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
import { CaretDownSmallIcon } from 'tdesign-icons-vue-next' //排序图表
import { COLUMNS, PERSON_COLUMNS } from '../constants'
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
  activeStatus: {
    type: Number,
    default: 0
  }
})
// 发送事件给父组件
const emit = defineEmits([
  'handleBuild',
  'handleClickCancel',
  'handleSortChange',
  'onPageChange',
  'handleClickAssign',
])
const height = ref('auto')
// 监听器赋值
watch(props, () => {
  dataLoading.value = false

  // 弹窗里面的列表
  if (props.activeStatus == 1) {
    tableColumns.value = PERSON_COLUMNS
    data.value = props.DialogFormData
    pagination.value = props.AssignPagination
    pagination.value.current = props.AssignPagination.defaultCurrent == 1 ? 1 : props.AssignPagination.defaultCurrent
    pagination.value.pageSize = props.AssignPagination.defaultPageSize == 1 ? 1 : props.AssignPagination.defaultPageSize
    height.value = '335'
  } else {
    // 列表
    tableColumns.value = COLUMNS
    data.value = props.listData
    pagination.value = props.pagination
    pagination.value.current = props.pagination.defaultCurrent == 1 ? 1 : props.pagination.defaultCurrent
    pagination.value.pageSize = props.pagination.defaultPageSize == 1 ? 1 : props.pagination.defaultPageSize
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

// 查看详情
const handleDetail = (val) => {
  router.push('/coupon/couponList/editCoupon/' + val.id)
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
// 新增优惠券
const handleBuild = () => {
  router.push('/coupon/couponList/addCoupon')
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
