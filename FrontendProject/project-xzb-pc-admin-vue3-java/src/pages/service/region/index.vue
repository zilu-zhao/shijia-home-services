<!-- 区域管理 -->
<template>
  <router-view v-if="url !== '/service/region'"></router-view>
  <div v-else class="base-up-wapper bgTable">
    <!-- 表格 -->
    <tableList
      :list-data="listData"
      :pagination="pagination"
      @handleBuild="handleBuild"
      @handleClickDelete="handleClickDelete"
      @handleClickEdit="handleClickEdit"
      @fetchData="fetchData"
      @handleSort="handleSort"
      @handleRefreshCache="handleRefreshCache"
      @onPageChange="onPageChange"
    ></tableList>
    <!-- end -->
    <!-- 新增，编辑弹窗 -->
    <DialogForm
      ref="dialogForm"
      :visible="visible"
      :title="title"
      :cityList="cityList"
      :edit="edit"
      :formData="formData"
      @handleClose="handleClose"
      @confirmEdit="confirmEdit"
    />
    <!-- end -->
    <!-- 删除弹窗 -->
    <Delete
      :dialog-delete-visible="dialogDeleteVisible"
      :delete-text="deleteText"
      :title="title"
      @handle-delete="handleDelete"
      @handle-close="handleClose"
    ></Delete>
    <!-- end -->
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute } from 'vue-router'
import {
  regionList,
  regionAdd,
  regionEdit,
  regionDelete,
  regionInactiveStatus,
  regionActiveStatus,
  regionRefreshCache
} from '@/api/service'
import { cityList } from './city' // 城市列表
import DialogForm from './components/DialogForm.vue' // 新增,编辑区域弹窗.
import tableList from './components/TableList.vue' // 表格
import Delete from '@/components/Delete/index.vue' // 删除弹层

const route = useRoute()
const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const dialogForm = ref(null) // 弹窗
const title = ref('新增区域') // 弹窗标题
const dialogDeleteVisible = ref(false) // 控制删除弹层显示隐藏
const deleteText = ref('确定删除该区域吗？') // 删除的内容
const url = ref('') // 当前路由
const edit = ref(false) // 是否是编辑
const editStatus = ref(0) // 是否是编辑
const editId = ref('') // 编辑的id
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
// 请求数据参数
const requestData = ref({
  isAsc1: 'false',
  isAsc2: '',
  orderBy1: 'updateTime',
  orderBy2: '',
  pageNo: 1,
  pageSize: 10
})
// 表单内容
const formData = ref({
  cityCode: '',
  name: '',
  managerPhone: '',
  managerName: ''
}) // 表单内容
const deleteId = ref('') // 删除的id
// 分页
// 获取列表数据
const fetchData = async (val) => {
  await regionList(val)
    .then((res) => {
      if (res.code === 200) {
        listData.value = res.data.list
        pagination.value.total = Number(res.data.total)
      } else {
        MessagePlugin.error(res.msg)
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
}
// 点击新建
const handleBuild = () => {
  edit.value = false
  // 显示新建弹窗
  visible.value = true
  // 将弹窗的标题改为新建
  title.value = '新建区域'
}
// 点击编辑
const handleClickEdit = (val) => {
  editId.value = val.id
  formData.value.cityCode = val.cityCode
  formData.value.name = val.name
  formData.value.managerPhone = val.managerPhone
  formData.value.managerName = val.managerName
  visible.value = true
  // 将弹窗的标题改为新建
  edit.value = true
  title.value = '编辑区域'
}
// 确认新增或编辑
const confirmEdit = async (val) => {
  if (title.value === '新建区域') {
    // 新增
    await regionAdd(val)
      .then((res) => {
        if (res.code === 200) {
          MessagePlugin.success('新增成功')
          dialogForm.value.onClickCloseBtn()
          fetchData(requestData.value)
        } else {
          MessagePlugin.error(res.data.msg)
          dialogForm.value.onClickCloseBtn()
        }
      })
      .catch((err) => {
        console.log(err)

      })
  } else {
    // 编辑
    await regionEdit(
      { managerName: val.managerName, managerPhone: val.managerPhone },
      editId.value
    )
      .then((res) => {
        if (res.data.code === 200) {
          MessagePlugin.success('编辑成功')
          dialogForm.value.onClickCloseBtn()
          fetchData(requestData.value)
        } else {
          MessagePlugin.error(res.data.msg)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
// 点击删除,启用,禁用
const handleClickDelete = (row, val) => {
  editStatus.value = val
  deleteId.value = row.id
  dialogDeleteVisible.value = true
  if (val === 3) {
    deleteText.value = '确定删除该区域吗？'
    title.value = '删除区域'
  } else if (val === 0 || val === 1) {
    deleteText.value = '确定启用该区域吗？'
    title.value = '启用区域'
  } else {
    deleteText.value = '区域被禁用后，用户将无法进行服务下单，是否禁用？'
    title.value = '禁用区域'
  }
}
// 确认删除
const handleDelete = async () => {
  if (editStatus.value === 3) {
    await regionDelete(deleteId.value)
      .then((res) => {
        if (res.code === 200) {
          MessagePlugin.success('删除成功')
          dialogDeleteVisible.value = false
          fetchData(requestData.value)
        } else {
          MessagePlugin.error(res.data.msg)
          dialogDeleteVisible.value = false
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (editStatus.value === 1 || editStatus.value === 0) {
    await regionActiveStatus(deleteId.value)
      .then((res) => {
        if (res.data.code === 200) {
          MessagePlugin.success('启用成功')
          dialogDeleteVisible.value = false
          fetchData(requestData.value)
        } else {
          MessagePlugin.error(res.data.msg)
          dialogDeleteVisible.value = false
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    await regionInactiveStatus(deleteId.value)
      .then((res) => {
        if (res.data.code === 200) {
          MessagePlugin.success('禁用成功')
          dialogDeleteVisible.value = false
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
}
// 点击排序
const handleSort = (val) => {
    requestData.value.isAsc1 = val.descending === true ? 'false' : 'true'
    fetchData(requestData.value)
}
// 点击翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
// 刷新区域相关缓存
const handleRefreshCache = async (val) => {
  await regionRefreshCache(val)
    .then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('刷新成功')
      } else {
        MessagePlugin.error(res.data.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 监听
watchEffect(() => {
  pagination.value.defaultCurrent = 1
  pagination.value.defaultPageSize = 10
  url.value = route.path
  if (route.path === '/service/region') {
    fetchData(requestData.value)
  }
})
</script>
