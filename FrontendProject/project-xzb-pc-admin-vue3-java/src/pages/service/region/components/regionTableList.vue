<!-- 内层设置服务页列表 -->
<template>
  <div class="baseList bg-wt">
    <div class="tableBoxs">
      <t-config-provider :global-config="globalLocale">
        <t-table
          ref="tableRef"
          :data="data"
          :columns="regionCOLUMN"
          :row-key="rowKey"
          vertical-align="middle"
          :hover="true"
          :pagination="
            pagination.total <= 10 || !pagination.total ? null : pagination
          "
          :disable-data-page="pagination.total <= 10"
          :loading="dataLoading"
          :sort="sort"
          :hide-sort-tips="true"
          :show-sort-column-bg-color="true"
          table-layout="fixed"
          @page-change="onPageChange"
          table-content-width="100%"
        >
          <!-- 空页面 -->
          <template #empty>
            <NoData></NoData>
          </template>
          <!-- 是否热门 -->
          <template #isHot="{ row }">
            <div class="isHot">
              <span>{{ row.isHot === 1 ? '是' : '否' }}</span>
            </div>
          </template>
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op="{ row }">
            <a
              class="font-bt btn-split-right"
              @click="handleClickSetHot(row)"
              >{{ row.isHot === 0 ? '设置热门' : '取消热门' }}</a
            >
            <a
              :class="
                isActive == '1' || row.saleStatus !== 0
                  ? 'text-forbidden btn-dl line'
                  : 'btn-dl line'
              "
              @click="handleClickDelete(row)"
              >删除</a
            >
            <a
              class="font-bt btn-split-left"
              @click="handleClickConfirm(row, row.saleStatus)"
              >{{ row.saleStatus !== 2 ? '上架' : '下架' }}</a
            >
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
import { ref, watch, computed } from 'vue'
import { CaretDownSmallIcon } from 'tdesign-icons-vue-next'
import { Input } from 'tdesign-vue-next'
import NoData from '@/components/noData/index.vue'
// 接收父组件传递的值
const props = defineProps({
  listData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isActive: {},
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
  'handleClickSetHot',
  'handleClickDelete',
  'handleEditPrice',
  'onPageChange',
  'handleClickConfirm'
])
// 监听器赋值
watch(props, () => {
  if (!props.listData) {
    data.value = []
    dataLoading.value = false
    return
  }
  data.value = props.listData
  pagination.value = props.pagination
  dataLoading.value = false
})
// 排序
const sort = ref({
  // 按照服务调用次数进行排序
  sortBy: 'serviceCallNumber'
}) // 排序
const globalLocale = ref({
  table: {
    sortIcon: (h) => h && h(CaretDownSmallIcon)
  }
}) // 排序图标
const data: any = ref([])
// 选中的行
const pagination: any = ref({
  defaultPageSize: 8,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
// 索引
const rowKey = 'index' // 行的key
// 加载状态
const dataLoading = ref(true)

// 点击查设为热门
const handleClickSetHot = (val) => {
  emit('handleClickSetHot', val)
}
// 点击删除
const handleClickDelete = (row: { rowIndex: any }) => {
  emit('handleClickDelete', row)
}
// 点击启用
const handleClickConfirm = (row: { rowIndex: any }, flag) => {
  emit('handleClickConfirm', row, flag)
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
// 列表配置
const regionCOLUMN = computed(() => [
  {
    title: '服务名称',
    align: 'left',
    width: 160,
    minWidth: '70px',
    colKey: 'serveItemName'
  },
  { title: '服务类型', width: 150, minWidth: '150px', colKey: 'serveTypeName' },
  {
    title: '参考价格',
    width: 150,
    minWidth: '150px',
    colKey: 'referencePrice'
  },
  {
    title: '区域价格',
    width: 300,
    colKey: 'price',
    edit: {
      component: Input,
      props: {
        clearable: true,
        autofocus: true
      },
      validateTrigger: 'change',
      abortEditOnEvent: ['onEnter', 'onBlur'],
      // 编辑完成，退出编辑态后触发
      onEdited: (context) => {
        emit('handleEditPrice', context.newRowData)
      },
      rules: [
        { required: true, message: '不能为空' },
        {
          message: '必须为大于0,小于10000的数字，且保留两位小数',
          validator: (val) => {
            // const reg = /^1[3456789]\d{9}$/
            if (Number(val) > 10000 || Number(val) <= 0) {
              return {
                result: false,
                message: '参考服务单价最大不超过10000,最小不小于0',
                type: 'error'
              }
            }
            return true
          }
        }
      ]
    }
  },
  {
    title: '是否热门',
    width: 300,
    minWidth: '180px',
    colKey: 'isHot'
  },
  {
    title: '状态',
    colKey: 'saleStatus',
    minWidth: '120px',
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '草稿'
        },
        1: {
          label: '下架'
        },
        2: {
          label: '上架'
        }
      }
      return h(
        'span',
        {
          class: `status-dot status-dot-${row.saleStatus}`
        },
        statusList[row.saleStatus].label
      )
    }
  },
  {
    align: 'left',
    fixed: 'right',
    width: 180,
    minWidth: '180px',
    colKey: 'op',
    title: '操作'
  }
])
</script>
<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.baseList {
  padding-top: 0 !important;
}
.tableBoxs {
  margin: 20px 0 0 0;
}
:deep(
    .t-table--bordered.t-table__content--scrollable-to-right
      .t-table__cell--fixed-right-first::after
  ) {
  border: none;
}
:deep(.t-table:not(.t-table--row-edit) .t-table__cell--editable .t-icon) {
  margin-left: 10px;
  font-size: 14px !important;
  color: var(--color-bk1);
}
</style>
