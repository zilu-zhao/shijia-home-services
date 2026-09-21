<!-- 服务项管理管理页 -->
<template>
  <router-view v-if="url !== '/service/ServiceList'"></router-view>
  <div v-else class="base-up-wapper bgTable min-h">
    <!-- 搜索表单区域 -->
    <searchFormBox
      :initSearch="initSearch"
      :typeSelect="typeSelect"
      @handleSearch="handleSearch"
      @handleReset="handleReset"
    ></searchFormBox>
    <!-- end -->
    <!-- 表格 -->
    <tableList
      :list-data="listData"
      :pagination="pagination"
      @handleSetupContract="handleSetupContract"
      @handleBuild="handleBuild"
      @handleClickDelete="handleClickDelete"
      @fetchData="fetchData"
      @onPageChange="onPageChange"
      @handleSortChange="handleSortChange"
    ></tableList>
    <!-- end -->
    <!-- 删除弹窗 -->
    <Delete
      :dialog-delete-visible="dialogDeleteVisible"
      :delete-text="deleteText"
      @handle-delete="handleDelete"
      @handle-close="handleClose"
    ></Delete>
    <!-- end -->
    <!-- 启用/禁用弹窗 -->
    <Confirm
      :title="confirmTitle"
      :dialog-confirm-visible="dialogConfirmVisible"
      :confirm-text="confirmText"
      @handle-confirm="handleConfirm"
      @handle-close="handleClose"
    ></Confirm>
    <!-- end -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import {
  serviceTypeSimpleList,
  serviceItemList,
  serviceItemActivateStatus,
  serviceItemDeactivateStatus,
  serviceItemDelete
} from '@/api/service'
import { forEach } from 'lodash'
import tableList from './components/TableList.vue' // 表格
import Delete from '@/components/Delete/index.vue' // 删除弹层
import Confirm from '@/components/Confirm/index.vue' // 确认弹层
import searchFormBox from './components/SearchForm.vue' // 搜索框表单

const first = ref(true)
const route = useRoute()
const router = useRouter()
const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const dataLoading = ref(false) // 列表数据加载loading
const confirmTitle = ref('确认禁用') // 确认弹窗标题
const dialogDeleteVisible = ref(false) // 控制删除弹层显示隐藏
const dialogConfirmVisible = ref(false) // 控制确认弹层显示隐藏
const deleteText = ref('此操作将永久删除这条信息，是否继续？') // 删除的内容
const confirmText = ref('此操作将永久禁用这条信息，是否继续？') // 确认的内容
const url = ref('') // 当前路由
const initSearch = ref(null) // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
const deleteId = ref('') // 删除的id

// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1, // 默认当前页
  current: 1
})
const requestData = ref({
  isAsc1: true,
  isAsc2: false,
  orderBy1: 'sortNum',
  orderBy2: 'updateTime',
  pageNo: 1,
  pageSize: 10,
  name: '',
  serveTypeId: '',
  activeStatus: null
}) // 请求参数
const resetData = ref({
  isAsc1: true,
  isAsc2: false,
  orderBy1: 'sortNum',
  orderBy2: 'updateTime',
  pageNo: 1,
  pageSize: 10,
  name: '',
  serveTypeId: '',
  activeStatus: null
}) 
// 上禁用数据
const setupContractData = ref({
  id: '',
  flag: 0
})
// 搜索功能
const handleSearch = (val) => {
  requestData.value.name = val.name
  requestData.value.serveTypeId = val.serveTypeId
  requestData.value.activeStatus = val.activeStatus
  requestData.value.pageNo = 1
  pagination.value.defaultCurrent = 1
  pagination.value.current = 1
  fetchData(requestData.value)
}
// 分页

// 重置，清空搜索框
const handleReset = () => {
  // 清空搜索框的全部内容并且重新获取数据
  // 重置页码
  initSearch.value = null
  pagination.value.defaultCurrent = 1
  pagination.value.current = 1
  fetchData(requestData.value)
  // 重新渲染table
}
// 获取服务类型下拉框数据
const getServiceTypeSimpleList = async () => {
  await serviceTypeSimpleList()
    .then((res) => {
      if (res.code === 200) {
        typeSelect.value = res.data
      } else {
        MessagePlugin.error(res.message)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 获取列表数据
const fetchData = async (val) => {
  dataLoading.value = true
  await serviceItemList(val)
    .then((res) => {
      if (res.code === 200) {
        listData.value = res.data.list
        pagination.value.total = Number(res.data.total)
        dataLoading.value = false
        first.value = false
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 关闭弹窗
const handleClose = () => {
  visible.value = false // 关闭新增弹窗
  dialogDeleteVisible.value = false // 关闭删除弹层
  dialogConfirmVisible.value = false // 关闭确认弹层
}
// 点击新建
const handleBuild = () => {
  router.push('/service/ServiceList/addService')
}
// 上禁用
const handleSetupContract = (val, id) => {
  dialogConfirmVisible.value = true
  setupContractData.value.id = val.id
  if (id !== 2) {
    confirmTitle.value = '确认启用'
    confirmText.value = '确定启用该服务吗？'
    setupContractData.value.flag = 2
  } else {
    confirmTitle.value = '确认禁用'
    confirmText.value = '确定禁用该服务吗？'
    setupContractData.value.flag = 1
  }
}
// 确认上禁用
const handleConfirm = async () => {
  if (setupContractData.value.flag === 2) {
    await serviceItemActivateStatus(setupContractData.value.id)
      .then((res) => {
        if (res.data.code === 200) {
          dialogConfirmVisible.value = false
          MessagePlugin.success('操作成功')
          fetchData(requestData.value)
        } else {
          MessagePlugin.error(res.data.msg)
          dialogConfirmVisible.value = false
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    await serviceItemDeactivateStatus(setupContractData.value.id)
      .then((res) => {
        if (res.data.code === 200) {
          dialogConfirmVisible.value = false
          MessagePlugin.success('操作成功')
          fetchData(requestData.value)
        } else {
          MessagePlugin.error(res.data.msg)
          dialogConfirmVisible.value = false
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
// 确认删除
const handleDelete = async () => {
  await serviceItemDelete(deleteId.value).then((res) => {
    if (res.code === 200) {
      dialogDeleteVisible.value = false
      MessagePlugin.success('删除成功')
      fetchData(requestData.value)
    } else {
      MessagePlugin.error(res.msg)
      dialogConfirmVisible.value = false
    }
  })
}
// 点击删除
const handleClickDelete = (row) => {
  deleteId.value = row.id
  dialogDeleteVisible.value = true
}
// 排序
const handleSortChange = (val) => {
  forEach(val, (item) => {
    if (item.sortBy === 'sortNum') {
      if (item.descending === true) {
        requestData.value.isAsc1 = false
      } else {
        requestData.value.isAsc1 = true
      }
    } else {
      if (item.descending === true) {
        requestData.value.isAsc2 = false
      } else {
        requestData.value.isAsc2 = true
      }
    }
  })
  fetchData(requestData.value)
}
// 翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
watchEffect(() => {
  pagination.value.defaultCurrent = 1
  pagination.value.current = 1
  pagination.value.defaultPageSize = 10
  url.value = route.path
  if (route.path === '/service/ServiceList') {
    if (!initSearch.value && route.query.id) {
      getServiceTypeSimpleList()
      initSearch.value = route.query.id
      requestData.value.serveTypeId = initSearch.value
      router.replace({
        path: route.path,
        query: {}
      })
      fetchData(requestData.value)
    } else if (!initSearch.value) {
      getServiceTypeSimpleList()
      fetchData(resetData.value)
    }
  } else {
    fetchData(resetData.value)
  }
})

watch(
  () => route.query,
  () => {
    if(first.value === false){
      fetchData(requestData.value)
    }
  }
)
</script>
<style lang="less" scoped>
.min-h {
  min-height: 720px !important;
}
</style>
