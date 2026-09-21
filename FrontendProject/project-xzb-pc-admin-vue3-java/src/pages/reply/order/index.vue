<!-- 评价页，暂时先放在这里大概率换方案，不用这个 -->
<template>
  <router-view v-if="url !== '/reply/index'"></router-view>
  <div v-else class="tab-wapper bg-wt">
    <switchBar
      :data="tableBar"
      :reply-type="replyType"
      @changeId="changeId"
    ></switchBar>
    <!-- 占位 -->
    <div class="division"></div>
    <!-- 搜索表单 -->
    <searchFormBox
      :reply-type="replyType"
      :init-search-id="initSearchId"
      @handleSearch="handleSearch"
      @handleReset="handleReset"
    ></searchFormBox>
    <!-- end -->
    <!-- 表格 -->
    <tableList
      :list-data="listData"
      :pagination="pagination"
      :reply-type="replyType"
      :data-loading="dataLoading"
      @handleSetupContract="handleSetupContract"
      @handleBuild="handleBuild"
      @handleClickDelete="handleClickDelete"
      @fetchData="fetchData"
      @getActiveId="getActiveId"
      @handlePageChange="handlePageChange"
    ></tableList>
    <!-- end -->
    <!-- 新增，编辑弹窗 -->
    <dialog-form
      ref="edit"
      :visible="visible"
      :title="title"
      :target-type="replyType"
      :data="DialogFormData"
      :form-data="formData"
      @handleClose="handleClose"
      @fetchData="fetchData"
      @replayComment="replayComment"
    />
    <!-- end -->
    <!-- 删除弹层 -->
    <Delete
      :dialog-delete-visible="dialogDeleteVisible"
      :delete-text="deleteText"
      @handle-delete="handleDelete"
      @handle-close="handleClose"
    ></Delete>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, reactive, watchEffect } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import moment from 'moment'
import { getList } from '@/api/list'
import DialogForm from '@/components/editDialog/index.vue' // 新增,编辑弹窗.
import Delete from '@/components/Delete/index.vue' // 删除弹层
import tableList from './components/TableList.vue' // 表格
import searchFormBox from './components/SearchForm.vue' // 搜索框表单
import switchBar from '@/components/switchBar/switchBartop.vue' // tab切换组件
// import { deleteComments, replayComments } from '@/api/detail'
import { DetailDataType } from './type'

const initSearchId = ref('') // 初始化搜索框的值
const deleteData = ref({} as DetailDataType)
const visible = ref(false) // 新增，编辑弹窗
const listData = ref<Array<DetailDataType>>([]) // 列表数据
const dataLoading = ref(false)
const DialogFormData = ref({} as DetailDataType) // 弹窗表单内容
const dialogDeleteVisible = ref(false) // 控制删除弹层显示隐藏
const deleteText = ref('此操作将永久删除这条评价，是否继续？') // 删除的内容
const title = ref('新建') // 弹窗标题
const replyType = ref('0') // 评价类型id
const dialogConfirmVisible = ref(false) // 控制确认弹层显示隐藏
const route = useRoute()
const router = useRouter()
const url = ref('')
const edit = ref()
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1, // 默认当前页
  targetType: replyType.value,
  infoType: 1
})
// 搜索框表单内容
const searchForm = ref({
  replyType: replyType.value,
  infoType: 1,
  scoreLevel: '',
  targetId: '',
  minEvaluationTime: '',
  maxEvaluationTime: ''
})
// 请求数据数组
const requestData = ref({
  targetTypeId: replyType.value,
  scoreLevel: '',
  targetId: '',
  minEvaluationTime: '',
  maxEvaluationTime: '',
  pageNo: 1,
  pageSize: 10
})
// 重置表单请求的数据
const resetData = ref({
  targetTypeId: replyType.value,
  scoreLevel: '',
  targetId: '',
  minEvaluationTime: '',
  maxEvaluationTime: '',
  pageNo: 1,
  pageSize: 10
})
const replyData = ref({
  ownerId: '',
  evaluationId: '',
  parentId: 0,
  isAnonymous: 0,
  content: '',
  pictureArray: []
})
// 批量回复数据
const batchRepliesData = reactive({
  ids: [],
  content: '',
  pictureArray: []
})
// tab栏切换数据
const tableBar = ref([
  {
    id: '0',
    name: '服务项评价'
  },
  {
    id: '1',
    name: '服务人员评价'
  }
])
const getTableBar = () => {
  // const data = objectTypeStore.ObjectType
  // 在tableBar中创建与data长度相同的数组
  // if (tableBar.value.length !== objectTypeStore.ObjectType.length) {
  //   for (let i = 0; i < data.length; i++) {
  //     tableBar.value.push({
  //       id: data[i].id,
  //       name: data[i].name
  //     })
  //   }
  // }
}
// tab切换
// tab切换
const changeId = (val) => {
  replyType.value = val
  pagination.value.targetType = val
  searchForm.value.replyType = val
  requestData.value.targetTypeId = val
  resetData.value.targetTypeId = val
  fetchData(resetData.value)
}
// 表单内容
const formData = ref({ ...searchForm }) // 表单内容

// 获取近三个月的起始时间和结束时间，精确到秒
const getThreeMonth = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  const threeMonth = new Date(year, month - 4, day, hour, min, sec)
  const threeMonthTime = threeMonth.getTime()
  const nowTime = date.getTime()
  const threeMonthDate = new Date(threeMonthTime)
  const nowDate = new Date(nowTime)
  // 将时间转换为字符串 年-月-日 时:分:秒，使用moment.js
  let threeMonthStr = moment(threeMonthDate).format('YYYY-MM-DD HH:mm:ss')
  // 将threeMonthStr的值转化为前一天的00：00：00
  threeMonthStr = `${moment(threeMonthStr)
    .add(1, 'days')
    .format('YYYY-MM-DD HH:mm:ss')
    .substring(0, 10)} 00:00:00`
  let nowStr = moment(nowDate).format('YYYY-MM-DD HH:mm:ss')
  // 将nowStr的值转化为第二天的00：00：00
  nowStr = `${moment(nowStr)
    .add(1, 'days')
    .format('YYYY-MM-DD HH:mm:ss')
    .substring(0, 10)} 00:00:00`
  requestData.value.minEvaluationTime = threeMonthStr
  requestData.value.maxEvaluationTime = nowStr
  resetData.value.minEvaluationTime = threeMonthStr
  resetData.value.maxEvaluationTime = nowStr
}
// 搜索功能
const handleSearch = (val) => {
  if (val.scoreLevel === undefined) {
    val.scoreLevel = ''
  }
  requestData.value.scoreLevel = val.scoreLevel
  requestData.value.targetId = val.targetId
  // 如果val.updateTime不为空数组，再将其添加到requestData中，否则不添加，因为后端不接受空数组
  if (val.updateTime.length !== 0) {
    requestData.value.minEvaluationTime = val?.updateTime[0]
    requestData.value.minEvaluationTime = `${requestData.value.minEvaluationTime} 00:00:00`
    requestData.value.maxEvaluationTime = val?.updateTime[1]
    requestData.value.maxEvaluationTime = `${requestData.value.maxEvaluationTime} 23:59:59`
  }
  // 根据搜索框的内容进行搜索
  fetchData(requestData.value)
}
// 重置，清空搜索框
const handleReset = () => {
  // 重置页码
  pagination.value.defaultCurrent = 1
  resetData.value.targetTypeId = replyType.value
  fetchData(resetData.value)
}
// 获取列表数据
const fetchData = async (val) => {
  dataLoading.value = true
  try {
    // await getList(val)
    //   .then((res: any) => {
    //     if (res.code === 200) {
    //       listData.value = res.data.list
    //       pagination.value.total = Number(res.data.total)
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     if (err === 'refreshToken') {
    //       fetchData(val)
    //     } else {
    //       dataLoading.value = false
    //     }
    //   })
  } finally {
    dataLoading.value = false
  }
}
// 关闭弹窗
const handleClose = () => {
  visible.value = false // 关闭新增弹窗
  dialogDeleteVisible.value = false // 关闭删除弹层
  dialogConfirmVisible.value = false // 关闭确认弹层
}
// 点击新建
const handleBuild = () => {
  // 显示新建弹窗
  visible.value = true
  // 将弹窗的标题改为新建
  title.value = '批量回复'
}
// 点击编辑
const handleSetupContract = (val) => {
  DialogFormData.value = JSON.parse(JSON.stringify(val))
  // 显示新建弹窗
  visible.value = true
  // 将弹窗的标题改为新建
  title.value = '回复评价'
}
// 确认删除
const handleDelete = async () => {
  // await deleteComments(deleteData.value.id, replyType.value)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       fetchData(requestData.value)
  //       dialogDeleteVisible.value = false
  //       MessagePlugin.success('删除成功')
  //     } else {
  //       MessagePlugin.error(`删除失败,${res.msg}可能已被删除，请刷新后重试`)
  //     }
  //   })
  //   .catch((err) => {
  //     if (err === 'refreshToken') {
  //       handleDelete()
  //     } else {
  //       MessagePlugin.error(`删除失败,${err}`)
  //     }
  //   })
}
// 点击删除
const handleClickDelete = (row) => {
  deleteData.value = row
  dialogDeleteVisible.value = true
}
// 回复评论
const replayComment = async (val) => {
  // 校验输入框的内容
  replyData.value.ownerId = DialogFormData.value.ownerId
  replyData.value.evaluationId = DialogFormData.value.id
  replyData.value.parentId = 0
  replyData.value.content = val
  // await replayComments(replyType.value, replyData.value)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       MessagePlugin.success('回复成功')
  //       fetchData(requestData.value)
  //       edit.value.onClickCloseBtn()
  //     } else {
  //       MessagePlugin.error(`回复失败,${res.msg}`)
  //     }
  //   })
  //   .catch((err) => {
  //     if (err === 'refreshToken') {
  //       replayComment(val)
  //     } else {
  //       console.log(err)
  //     }
  //   })
}
// 获取选中项的ID
const getActiveId = (val) => {
  batchRepliesData.ids = val
}
// 翻页
const handlePageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  pagination.value.defaultCurrent = val.defaultCurrent
  pagination.value.defaultPageSize = val.defaultPageSize
  fetchData(requestData.value)
}
// 监听赋值
watchEffect(() => {
    getThreeMonth()
    if (route.path === '/reply/index') {
      url.value = '/reply/index'
    } else {
      url.value = route.path
    }
    if (replyType.value === '0') {
      getTableBar()
      if (localStorage.getItem('targetId')) {
        replyType.value = localStorage.getItem('targetTypeId').toString()
        requestData.value.targetTypeId = localStorage
          .getItem('targetTypeId')
          .toString()
        requestData.value.targetId = localStorage.getItem('targetId').toString()
        initSearchId.value = localStorage.getItem('targetId').toString()
        fetchData(requestData.value)
        // 清除localStorage中的targetId
        localStorage.removeItem('targetId')
        localStorage.removeItem('targetTypeId')
      }
      if (route.query.targetId) {
        replyType.value = route.query.targetTypeId.toString()
        requestData.value.targetTypeId = route.query.targetTypeId.toString()
        requestData.value.targetId = route.query.targetId.toString()
        initSearchId.value = route.query.targetId.toString()
        fetchData(requestData.value)
        // 清除query中的name
        router.replace({
          path: route.path,
          query: {}
        })
      } else {
        fetchData(requestData.value)
      }
    }
})
</script>
<style lang="less" scoped>
.headBox {
  background-color: #fafafa;
}
.division {
  height: 24.5px;
  width: 100%;
  background-color: #fafafa;
  display: inline-block;
  // 独占一行
  vertical-align: top;
}
</style>
