<!-- 机构管理页 -->
<template>
  <router-view v-if="url !== '/institution/information'"></router-view>
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
      :isActive="0"
      @handleBuild="handleBuild"
      @handleClickFreeze="handleClickFreeze"
      @fetchData="fetchData"
      @handleClickThaw="handleClickThaw"
      @onPageChange="onPageChange"
    ></tableList>
    <!-- end -->
    <!-- 新增，编辑弹窗 -->
    <DialogForm
      :visible="visible"
      :title="title"
      :data="DialogFormData"
      ref="dialogForm"
      @handleClose="handleClose"
      @fetchData="fetchData"
      @handleSubmit="handleFreeze"
    />
    <!-- end -->
    <!-- 解冻弹窗 -->
    <Delete
      :title="title"
      :dialog-delete-visible="dialogFreezeVisible"
      :delete-text="deleteText"
      @handle-delete="handleThaw"
      @handle-close="handleClose"
    ></Delete>
    <!-- end -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { serviceInstitutionList, servicePersonStatus } from '@/api/service'
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import Delete from '@/components/Delete/index.vue' // 解冻弹层
import searchFormBox from './components/SearchForm.vue' // 搜索框表单

const route = useRoute()
const router = useRouter()
const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const dataLoading = ref(false) // 列表数据加载loading
const DialogFormData = ref({}) // 弹窗表单内容
const title = ref('新建') // 弹窗标题
const dialogFreezeVisible = ref(false) // 控制解冻弹层显示隐藏
const deleteText = ref('解冻用户后，用户将恢复登录权限，是否确认解冻该用户？') // 删除的内容
const url = ref('') // 当前路由
const initSearch = ref() // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
const freezeId = ref('') // 删除的id
const dialogForm = ref(null) // 弹窗组件
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
const requestData = ref({
  pageNo: 1,
  pageSize: 10,
  canPickUp: null,
  name: '',
  phone: '',
  status: ''
}) // 请求参数
const resetData = ref({
  pageNo: 1,
  pageSize: 10,
  canPickUp: null,
  name: '',
  phone: '',
  status: ''
})
// 生命周期
onMounted(() => {
  fetchData(requestData.value)
})
watch(
  () => route.query,
  () => {
    pagination.value.defaultCurrent = 1
    pagination.value.defaultPageSize = 10
    fetchData(requestData.value)
  }
)
// 搜索功能
const handleSearch = (val) => {
  requestData.value.phone = val.phone
  requestData.value.pageNo = 1
  requestData.value.status = val.status === 2 ? null : val.status
  requestData.value.canPickUp = val.canPickUp === 2 ? null : val.canPickUp
  requestData.value.name = val.name
  pagination.value.defaultCurrent = 1
  fetchData(requestData.value)
}
// 分页

// 重置，清空搜索框
const handleReset = () => {
  // 清空搜索框的全部内容并且重新获取数据
  // 重置页码
  pagination.value.defaultCurrent = 1
  fetchData(requestData.value)
  // 重新渲染table
}
// 获取列表数据
const fetchData = async (val) => {
  dataLoading.value = true
  await serviceInstitutionList(val)
    .then((res) => {
      if (res.code === 200) {
        listData.value = res.data.list
        pagination.value.total = Number(res.data.total)
        dataLoading.value = false
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 关闭弹窗
const handleClose = () => {
  visible.value = false // 关闭新增弹窗
  dialogFreezeVisible.value = false // 关闭删除弹层
}
// 点击新建
const handleBuild = () => {
  router.push('/institution/information/informationDetail')
}
// 确认冻结
const handleFreeze = async (val) => {
  await servicePersonStatus({
    id: freezeId.value,
    status: 1,
    accountLockReason: val.accountLockReason
  }).then((res) => {
    if (res.data.code === 200) {
      dialogFreezeVisible.value = false
      MessagePlugin.success('冻结成功')
      fetchData(requestData.value)
      dialogForm.value.onClickCloseBtn()
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 点击冻结
const handleClickFreeze = (row) => {
  freezeId.value = row.id
  // 编辑弹窗
  visible.value = true
  title.value = '冻结原因'
}

// 点击解冻
const handleClickThaw = (row) => {
  freezeId.value = row.id
  // 编辑弹窗
  dialogFreezeVisible.value = true
  title.value = '解冻确认'
}
// 确认解冻
const handleThaw = async () => {
  await servicePersonStatus({
    id: freezeId.value,
    status: 0
  }).then((res) => {
    if (res.data.code === 200) {
      dialogFreezeVisible.value = false
      MessagePlugin.success('解冻成功')
      fetchData(requestData.value)
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
// 监听路由变化，三级菜单
watchEffect(() => {
  if (route.path === 'institution/information') {
    url.value = 'institution/information'
    fetchData(resetData.value)
  } else {
    url.value = route.path
    fetchData(resetData.value)
  }
})
</script>
