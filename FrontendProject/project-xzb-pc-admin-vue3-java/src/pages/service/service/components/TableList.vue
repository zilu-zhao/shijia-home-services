<!-- 服务项列表表格 -->
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
          <!-- 服务项图标 -->
          <template #serveTypeIcon="{ row }">
            <div class="headPortrait">
              <img
                :src="row.serveItemIcon"
                alt=""
                class="tdesign-demo-image-viewer__ui-image--img"
              />
            </div>
          </template>
          <!-- end -->
          <!-- 服务项图片 -->
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
          <!-- 描述 -->
          <template #description="{ row, rowIndex }">
            <div class="description" :class="rowIndex < 3 ? 'shortDescription' : ''">
              <span>{{ row.description }}</span>
              <span v-if="row.description.length > 36 && row.description.length <= 200" class="hover">{{
                row.description
              }}</span>
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
                row.activeStatus === 2
                  ? 'text-forbidden font-bt line'
                  : 'font-bt line'
              "
              @click="handleClickEdit(row)"
              >编辑</a
            >
            <a
              class="font-bt btn-split-left"
              @click="handleSetupContract(row, row.activeStatus)"
              >{{ row.activeStatus !== 2 ? '启用' : '禁用' }}</a
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
  'handleSetupContract',
  'handleBuild',
  'handleClickDelete',
  'handleSortChange',
  'onPageChange'
])
// 监听器赋值
watch(props, () => {
  data.value = props.listData
  pagination.value = props.pagination
  pagination.value.current = props.pagination.defaultCurrent == 1 ? 1 : props.pagination.defaultCurrent
  pagination.value.pageSize = props.pagination.defaultPageSize == 1 ? 1 : props.pagination.defaultPageSize
  dataLoading.value = false
})
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
// 点击跳转到编辑页
const handleClickEdit = (val) => {
  router.push('/service/ServiceList/editService/' + val.id)
}

// 打开上下架弹窗
const handleSetupContract = (val, id) => {
  emit('handleSetupContract', val, id)
}
// 点击删除
const handleClickDelete = (row: { rowIndex: any }) => {
  emit('handleClickDelete', row)
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
</script>
<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.baseList {
  :deep(.t-table td) {
    height: 64px !important;
  }
  .min-h{
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
</style>
