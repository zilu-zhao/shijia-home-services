<!-- 基础列表页（带图） -->
<template>
  <div class="base-up-wapper bgTable min-h">
    <!-- 搜索表单区域 -->
    <!-- <searchFormBox
      @handleSearch="handleSearch"
      @handleReset="handleReset"
    ></searchFormBox> -->
    <!-- end -->
    <!-- 表格 -->
    <tableList
      :list-data="listData"
      :pagination="pagination"
      @handleEdit="handleEdit"
      @handleBuild="handleBuild"
      @handleClickDelete="handleClickDelete"
      @fetchData="fetchData"
      @handleDisable="handleDisable"
      @handleSortChange="handleSortChange"
      @onPageChange="onPageChange"
    ></tableList>
    <!-- end -->
    <!-- 新增，编辑弹窗 -->
    <DialogForm
      ref="dialogForm"
      :visible="visible"
      :title="title"
      :data="formData"
      @handleClose="handleClose"
      @fetchData="fetchData"
      @handleSubmit="handleSubmit"
    />
    <!-- end -->
    <!-- 删除弹窗 -->
    <Delete
      :dialog-delete-visible="dialogDeleteVisible"
      :delete-text="deleteText"
      @handle-delete="handleDelete"
      @handle-close="handleClose"
    ></Delete>
    <!-- end -->
    <!-- 禁用/启用弹窗 -->
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
import { ref, onMounted, watchEffect, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute } from 'vue-router'
import {
  getServiceTypeList,
  serviceTypeActiveStatus,
  serviceTypeInactiveStatus,
  serviceTypeAdd,
  serviceTypeEdit,
  serviceTypeDelete
} from '@/api/service'
import Confirm from '@/components/Confirm/index.vue' // 确认弹层
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import Delete from '@/components/Delete/index.vue' // 删除弹层
import { forEach } from 'lodash'

const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const first = ref(true)
const route = useRoute()
const confirmTitle = ref('确认禁用')
const dialogForm = ref(null)
const title = ref('新建服务类型') // 弹窗标题
const dialogDeleteVisible = ref(false) // 控制删除弹层显示隐藏
const dialogConfirmVisible = ref(false) // 控制禁用弹层的显示隐藏
const deleteText = ref('确定删除该分类吗？') // 删除的内容
const confirmText = ref(
  '禁用该服务分类会导致分类下服务全部下架，确定禁用该分类吗？'
)
const edit = ref(false) // 是否是编辑
const editId = ref('') // 编辑的id
const deleteId = ref('') // 删除的id
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
// 请求数据
const requestData = ref({
  isAsc1: 'true',
  isAsc2: 'false',
  orderBy1: 'sortNum',
  orderBy2: 'updateTime',
  pageNo: 1,
  pageSize: 10
})
// 禁用数据
const disableData = ref({
  flag: 0,
  id: ''
})
// 搜索框表单
// 表单内容
const formData = ref({
  img: '',
  name: '',
  sortNum: '',
  serveTypeIcon: ''
}) // 表单内容
// 生命周期
onMounted(() => {
  fetchData(requestData.value)
})
watch(
  () => route.query,
  (val) => {
    pagination.value.defaultCurrent = 1
    pagination.value.defaultPageSize = 10
    if (first.value === false) {
      fetchData(requestData.value)
    }
  }
)
// 获取列表数据
const fetchData = async (val) => {
  await getServiceTypeList(val).then((res) => {
    if (res.code === 200) {
      listData.value = res.data.list
      pagination.value.total = Number(res.data.total)
      first.value = false
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 关闭弹窗
const handleClose = () => {
  visible.value = false // 关闭新增弹窗
  dialogDeleteVisible.value = false // 关闭删除弹层
  dialogConfirmVisible.value = false // 关闭禁用弹层
  // 清空表单内容
  formData.value.img = ''
  formData.value.name = ''
  formData.value.sortNum = ''
  formData.value.serveTypeIcon = ''
}
// 点击新建
const handleBuild = () => {
  edit.value = false
  // 显示新建弹窗
  visible.value = true
  // 将弹窗的标题改为新建
  title.value = '新建服务类型'
}
// 点击编辑
const handleEdit = (val) => {
  edit.value = true
  formData.value.img = val.img
  formData.value.name = val.name
  formData.value.sortNum = val.sortNum
  formData.value.serveTypeIcon = val.serveTypeIcon
  editId.value = val.id
  // 显示新建弹窗
  visible.value = true
  // 将弹窗的标题改为新建
  title.value = '编辑服务类型'
}
// 确认删除
const handleDelete = async () => {
  await serviceTypeDelete(deleteId.value)
    .then((res) => {
      if (res.code === 200) {
        dialogDeleteVisible.value = false
        MessagePlugin.success('删除成功')
        fetchData(requestData.value)
      } else {
        MessagePlugin.error(res.data.msg)
        dialogDeleteVisible.value = false
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 点击删除
const handleClickDelete = (row) => {
  deleteId.value = row.id
  dialogDeleteVisible.value = true
}
// 点击禁用/启用
const handleDisable = (val) => {
  disableData.value.id = val.id
  if (val.activeStatus === 2) {
    confirmTitle.value = '确认禁用'
    confirmText.value =
      '禁用该服务分类会导致分类下服务全部下架，确定禁用该分类吗？'
    disableData.value.flag = 0
  } else {
    confirmTitle.value = '确认启用'
    confirmText.value = '确定启用该分类吗？'
    disableData.value.flag = 1
  }
  dialogConfirmVisible.value = true
}
// 确认禁用/启用
const handleConfirm = async () => {
  dialogConfirmVisible.value = false
  if (disableData.value.flag === 0) {
    await serviceTypeInactiveStatus(disableData.value.id).then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('操作成功')
        fetchData(requestData.value)
      } else {
        MessagePlugin.error(res.data.msg)
      }
    })
  } else {
    await serviceTypeActiveStatus(disableData.value.id).then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('操作成功')
        fetchData(requestData.value)
      } else {
        MessagePlugin.error(res.data.msg)
      }
    })
  }
}
// 新增，编辑弹窗提交
const handleSubmit = async (val) => {
  // 提交的数据
  const data = {
    img: val.img[0].url,
    name: val.name,
    sortNum: val.sortNum,
    serveTypeIcon: val.serveTypeIcon[0].url
  }
  if (edit.value) {
    await serviceTypeEdit(data, editId.value).then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('编辑成功')
        fetchData(requestData.value)
        dialogForm.value.onClickCloseBtn()
      } else {
        MessagePlugin.error(res.data.msg)
      }
    })
  } else {
    await serviceTypeAdd(data).then((res) => {
      if (res.code === 200) {
        fetchData(requestData.value)
        MessagePlugin.success('新增成功')
        dialogForm.value.onClickCloseBtn()
      } else {
        MessagePlugin.error(res.data.msg)
      }
    })
  }
}
// 排序
const handleSortChange = (val) => {
  forEach(val, (item) => {
    if (item.sortBy === 'sortNum') {
      if (item.descending === true) {
        requestData.value.isAsc1 = 'false'
      } else {
        requestData.value.isAsc1 = 'true'
      }
    } else {
      if (item.descending === true) {
        requestData.value.isAsc2 = 'false'
      } else {
        requestData.value.isAsc2 = 'true'
      }
    }
  })
  fetchData(requestData.value)
}
// 分页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
watchEffect(() => {
  fetchData(requestData.value)
})
</script>
