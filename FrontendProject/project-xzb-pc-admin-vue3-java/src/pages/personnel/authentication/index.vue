<!-- 机构管理页 -->
<template>
  <div class="base-up-wapper bgTable min-h">
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
      @handleReject="handleReject"
      @onPageChange="onPageChange"
      @handleSortChange="handleSortChange"
      @handleApply="handleApply"
    ></tableList>
    <!-- end -->
    <!-- 驳回弹窗 -->
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
    <!-- 通过弹窗 -->
    <Delete
      :title="title"
      :dialog-delete-visible="dialogFreezeVisible"
      :delete-text="deleteText"
      @handle-delete="handleThaw"
      @handle-close="handleClose"
    ></Delete>
    <!-- end -->
    <!-- 申请弹窗 -->
    <ApplyDialog
      :visible="applyVisible"
      title="申请记录"
      :data="applyData"
      @handleClose="handleClose"
    ></ApplyDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { servicePersonAuditList, servicePersonAudit } from '@/api/service'
import { forEach } from 'lodash'
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import Delete from '@/components/Delete/index.vue' // 解冻弹层
import searchFormBox from './components/SearchForm.vue' // 搜索框表单
import ApplyDialog from './components/ApplyDialog.vue' // 申请弹窗

const route = useRoute()
const router = useRouter()
const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const dataLoading = ref(false) // 列表数据加载loading
const DialogFormData = ref({}) // 弹窗表单内容
const title = ref('新建') // 弹窗标题
const dialogFreezeVisible = ref(false) // 控制解冻弹层显示隐藏
const deleteText = ref(
  '此操作将同意该服务人员入驻平台，认证通过后，该服务人员可开启接单业务，是否确认通过实名认证申请？'
) // 删除的内容
const url = ref('') // 当前路由
const applyVisible = ref(false) // 申请弹窗
const initSearch = ref() // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
const freezeId = ref('') // 删除的id
const dialogForm = ref(null) // 弹窗组件
const applyData = ref([]) // 申请弹窗数据
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
const requestData = ref({
  isAsc1: false,
  orderBy1: 'createTime',
  orderBy2: null,
  isAsc2: null,
  pageNo: 1,
  pageSize: 10,
  name: null,
  auditStatus: null,
  certificationStatus: null,
  idCardNo: null
}) // 请求参数
const resetData = ref({
  isAsc1: false,
  orderBy1: 'createTime',
  orderBy2: null,
  isAsc2: null,
  pageNo: 1,
  pageSize: 10,
  name: null,
  auditStatus: null,
  certificationStatus: null,
  idCardNo: null
}) // 请求参数
// 生命周期
onMounted(() => {
  fetchData(requestData.value)
})
// 搜索功能
const handleSearch = (val) => {
  requestData.value.name = val.name
  requestData.value.idCardNo = val.idCardNo
  requestData.value.auditStatus = val.auditStatus === 2 ? null : val.auditStatus
  requestData.value.certificationStatus =
    val.certificationStatus === 1 ? null : val.certificationStatus
  requestData.value.pageNo = 1
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
  await servicePersonAuditList(val)
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
  applyVisible.value = false // 关闭申请弹窗
}
// 点击新建
const handleBuild = () => {
  router.push('/personnel/authentication/authenticationDetail')
}
// 确认冻结
const handleFreeze = async (val) => {
  await servicePersonAudit(
    {
      certificationStatus: 3,
      rejectReason: val.selectName
    },
    freezeId.value
  ).then((res) => {
    if (res.data.code === 200) {
      dialogFreezeVisible.value = false
      MessagePlugin.success('驳回成功')
      fetchData(requestData.value)
      dialogForm.value.onClickCloseBtn()
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 点击驳回
const handleClickFreeze = (row) => {
  freezeId.value = row.id
  // 编辑弹窗
  visible.value = true
  title.value = '驳回原因'
}
// 排序
const handleSortChange = (val) => {
  forEach(val, (item) => {
    if (item.sortBy === 'createTime') {
      if (item.descending === true) {
        requestData.value.isAsc1 = false
      } else {
        requestData.value.isAsc1 = true
      }
    } else {
      requestData.value.orderBy2 = item.sortBy
      if (item.descending === true) {
        requestData.value.isAsc2 = false
      } else {
        requestData.value.isAsc2 = true
      }
    }
  })
  fetchData(requestData.value)
}
// 点击通过
const handleReject = (row) => {
  freezeId.value = row.id
  // 编辑弹窗
  dialogFreezeVisible.value = true
  title.value = '确认通过'
}
// 确认通过
const handleThaw = async () => {
  await servicePersonAudit(
    {
      rejectReason: '',
      certificationStatus: 2
    },
    freezeId.value
  ).then((res) => {
    if (res.data.code === 200) {
      dialogFreezeVisible.value = false
      MessagePlugin.success('通过成功')
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
  pagination.value.defaultCurrent = val.defaultCurrent
  pagination.value.defaultPageSize = val.defaultPageSize
  fetchData(requestData.value)
}
// 打开申请弹窗
const handleApply = () => {
  applyData.value = listData.value
  applyVisible.value = true
}

watch(
  () => route.query,
  () => {
    pagination.value.defaultCurrent = 1
    pagination.value.defaultPageSize = 10
    fetchData(resetData.value)
  }
)
</script>
<style lang="less" scoped>
.min-h {
  min-width: 1107px;
}
</style>
