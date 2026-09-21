<!-- 表格 -->
<template>
  <div class="baseList bg-wt min-h">
    <div class="tableBoxs">
      <t-config-provider>
        <t-table
          :data="data"
          :columns="tableCOLUMNS"
          :row-key="rowKey"
          vertical-align="middle"
          :hover="true"
          :pagination="
            pagination.total <= 10 || !pagination.total ? null : pagination
          "
          :disable-data-page="pagination.total <= 10"
          :loading="dataLoading"
          showSizeChanger
          table-layout="fixed"
          :multiple-sort="true"
          table-content-width="100%"
          @page-change="onPageChange"
        >
          <!-- 空页面 -->
          <template #empty>
            <NoData></NoData>
          </template>
          <!-- 服务类型图标 -->
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
          <!-- 描述 -->
          <template #description="{ row, rowIndex }">
            <div
              class="description"
              :class="rowIndex < 3 ? 'shortDescription' : ''"
            >
              <span>{{ row.description }}</span>
              <span
                v-if="
                  row.description.length > 36 && row.description.length <= 200
                "
                class="hover"
                >{{ row.description }}</span
              >
            </div>
          </template>
          <!-- end -->
          <!-- 服务前照片 -->
          <template #serveBeforeImgs="{ row }">
            <div class="headPortrait" v-if="row.serveBeforeImgs">
              <t-image-viewer :images="row.serveBeforeImgs">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      alt="test"
                      :src="row.serveBeforeImgs[0]"
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
          <!-- end -->
          <!-- 服务后照片 -->
          <template #serveAfterImgs="{ row }">
            <div class="headPortrait" v-if="row.serveAfterImgs">
              <t-image-viewer :images="row.serveAfterImgs">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      alt="test"
                      :src="row.serveAfterImgs[0]"
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
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op="{ row }">
            <a
              class="font-bt btn-split-right"
              @click="handleClickFreeze(row, row.status)"
              >{{ row.status === 0 ? '冻结' : '解冻' }}</a
            >
            <a class="font-bt line" @click="handleClickEdit(row)">查看</a>
          </template>
          <!-- end -->
          <template #op2="{ row }">
            <a class="font-bt line" @click="handleClickOrderDetail(row)"
              >查看订单</a
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
import { ZoomInIcon } from 'tdesign-icons-vue-next'
import { COLUMNS, SERVE_DATA } from '../constants'
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
  'handleClickThaw'
])
// 监听器赋值
watch(props, () => {
  data.value = props.listData
  pagination.value = props.pagination
  pagination.value.current =
    props.pagination.defaultCurrent == 1 ? 1 : props.pagination.defaultCurrent
  pagination.value.pageSize =
    props.pagination.defaultPageSize == 1 ? 1 : props.pagination.defaultPageSize
  dataLoading.value = false
  if (props.isActive === 0) {
    tableCOLUMNS.value = []
    tableCOLUMNS.value = COLUMNS
  } else if (props.isActive === 3) {
    tableCOLUMNS.value = []
    tableCOLUMNS.value = SERVE_DATA
    data.value = props.listData
  }
})
// 表头COLUMNS
const tableCOLUMNS = ref()
// 路由
const router = useRouter()
const data: any = ref([]) // 表格数据
// 选中的行
const pagination: any = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
// 索引
const rowKey = 'index' // 行的key
// 加载状态
const dataLoading = ref(true)

// 点击跳转到详情页
const handleClickEdit = (val) => {
  router.push('/personnel/information/informationDetail/' + val.id)
}
// 点击冻结/解冻
const handleClickFreeze = (row, flag) => {
    emit('handleClickFreeze', row, flag)
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
// 点击查看订单
const handleClickOrderDetail = (row) => {
  router.push('/order/orderList/orderDetail/' + row.id)
}
</script>
<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.headPortrait {
  display: flex;
  align-items: center;
}
:deep(.t-table__filter-icon) {
  display: none;
}
</style>
