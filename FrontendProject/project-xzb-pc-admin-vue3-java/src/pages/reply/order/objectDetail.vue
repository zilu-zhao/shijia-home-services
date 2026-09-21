<template>
  <div class="detail-comment bg-wt">
    <div class="title">
      <div class="name">{{ title }}</div>
      <div class="font-bt" @click="handleComments(evaluationStatus)">
        {{ evaluationStatus ? '关闭评价' : '开启评价' }}
      </div>
    </div>
    <div class="title name allReply">全部评论（{{ evaluateCount }}）</div>
    <div class="comment">
      <div class="body">
        <div v-for="(item, index) in loadData" :key="index" class="card1">
          <!-- 左边头像 -->
          <div class="left1">
            <img
              v-if="item.evaluatorInfo.avatar"
              :src="item.evaluatorInfo.avatar"
              alt=""
            />
            <img v-else src="../../../assets/head@3x.png" alt="" />
          </div>
          <!-- 右边内容 -->
          <div class="right1">
            <!-- 名称 -->
            <div class="user">
              {{ item.evaluatorInfo.nickName }}
            </div>
            <!-- 内容 -->
            <div class="content">
              <span v-if="item.isTop == 1" class="Top">置顶</span
              ><span v-html="handleEmoji(item.content)"></span>
            </div>
            <!-- 底部栏 -->
            <div class="foot1">
              <!-- 时间 -->
              <span>{{ item.createTime }}</span>
              <!-- 操作 -->
              <div class="operation">
                <div class="like">
                  <div>点赞数：</div>
                  <span>{{
                    item.statistics?.likeNumber
                      ? item.statistics?.likeNumber
                      : 0
                  }}</span>
                </div>
                <div
                  class="reply"
                  @click="handleContract(item.id)"
                >
                  <div></div>
                  <span>{{ item.statistics?.replyNumber }}</span>
                </div>
                <div class="setTop" @click="handleSetTop(item.id, item.isTop)">
                  <div></div>
                  <span>{{ item.isTop == 0 ? '置顶' : '取消置顶' }}</span>
                </div>
                <div class="delete" @click="handleDeleteBtn(item.id, 1)">
                  <div></div>
                  <span>删除</span>
                </div>
              </div>
            </div>
            <div :id="item.id" class="Contract">
              <t-form
                :data="replayValue"
                :rules="evaluationRules"
                :label-width="0"
                @submit="onSubmit"
              >
                <t-form-item name="content"
                  ><t-textarea
                    v-model="replayValue.content"
                    placeholder="｜积极回复可以吸引更多人评论"
                    :maxlength="50"
                    class="commentText"
                    @blur="transferData(item)"
                  >
                  </t-textarea>
                  <button
                    v-if="replayValue.content.length >= 1"
                    type="submit"
                    class="bt btn-submit"
                  >
                    <span>发送</span>
                  </button>
                  <button v-else type="submit" class="bt btn-disabled">
                    <span>发送</span>
                  </button>
                </t-form-item>
              </t-form>
            </div>
            <!-- 默认显示的回复列表 -->
            <div
              class="card2"
            >
              <div
                v-for="(items, num) in item.replyArray"
                :key="num"
                class="box"
              >
                <div class="left2">
                  <img
                    v-if="items.replierInfo.avatar"
                    :src="items.replierInfo.avatar"
                    alt=""
                  />
                  <img v-else src="../../../assets/head@3x.png" alt="" />
                </div>
                <div class="right2">
                  <div
                    v-if="items.parentId === '0' || !items.parentId"
                    class="user"
                  >
                    {{ items.replierInfo.nickName }}
                  </div>
                  <div v-else class="user">
                    {{ items.replierInfo.nickName }} <span>回复</span>
                    {{ items.targetReplierInfo.nickName }}
                  </div>
                  <div class="content">
                    <span v-html="handleEmoji(items.content)"></span>
                  </div>
                  <div class="foot2">
                    <span>{{ items.createTime }}</span>
                    <div class="operation">
                      <!-- <div class="like" @click="handleContract(items.id)">
                        <div></div>
                        <span>回复</span>
                      </div> -->
                      <div class="reply" @click="handleContract(items.id)">
                        <div></div>
                        <span>回复</span>
                      </div>
                      <div class="delete" @click="handleDeleteBtn(items.id, 2)">
                        <div></div>
                        <span>删除</span>
                      </div>
                    </div>
                  </div>
                  <div :id="`${items.id?.toString()}`" class="Contract">
                    <t-form
                      :data="replayValue"
                      :rules="replyRules"
                      :label-width="0"
                      @submit="onSubmits"
                    >
                      <t-form-item name="content"
                        ><t-textarea
                          v-model="replayValue.content"
                          placeholder="｜积极回复可以吸引更多人评论"
                          :maxlength="50"
                          class="commentText"
                          @blur="transferData(items, item.id, item.ownerId)"
                        >
                        </t-textarea>
                        <button
                          v-if="replayValue.content.length >= 1"
                          type="submit"
                          class="bt btn-submit"
                        >
                          <span>发送</span>
                        </button>
                        <button v-else type="submit" class="bt btn-disabled">
                          <span>发送</span>
                        </button>
                      </t-form-item>
                    </t-form>
                  </div>
                </div>
              </div>
            </div>
            <!-- 展开的回复列表 -->
            <div
              class="card2"
            >
              <div
                v-for="(content, num) in moreReplayData[item.id]"
                :key="num"
                class="box"
              >
                <div class="left2">
                  <img
                    v-if="content.replierInfo.avatar"
                    :src="content.replierInfo.avatar"
                    alt=""
                  />
                  <img v-else src="../../../assets/head@3x.png" alt="" />
                </div>
                <div class="right2">
                  <div v-if="content.parentId == 0" class="user">
                    {{ content.replierInfo?.nickName }}
                  </div>
                  <div v-else class="user">
                    {{ content.replierInfo?.nickName }}
                    <span v-if="content.targetReplierInfo">回复</span>
                    {{ content.targetReplierInfo?.nickName }}
                  </div>
                  <div class="content">
                    <span v-html="handleEmoji(content.content)"></span>
                  </div>
                  <div class="foot2">
                    <span>{{ content.createTime }}</span>
                    <!-- 操作 -->
                    <div class="operation">
                      <div class="like">
                        <div>点赞数：</div>
                        <span>{{
                          item.statistics?.likeNumber
                            ? item.statistics?.likeNumber
                            : 0
                        }}</span>
                      </div>
                      <div class="reply" @click="handleContract(content.id)">
                        <div></div>
                        <span>回复</span>
                      </div>
                      <div
                        class="delete"
                        @click="handleDeleteBtn(content.id, 2)"
                      >
                        <div></div>
                        <span>删除</span>
                      </div>
                    </div>
                  </div>
                  <div :id="`${content.id.toString()}`" class="Contract">
                    <t-form
                      :data="replayValue"
                      :rules="replyRules"
                      :label-width="0"
                      @submit="onSubmits"
                    >
                      <t-form-item name="content"
                        ><t-textarea
                          v-model="replayValue.content"
                          placeholder="｜积极回复可以吸引更多人评论"
                          :maxlength="50"
                          class="commentText"
                          @blur="transferData(content)"
                        >
                        </t-textarea>
                        <button
                          v-if="replayValue.content.length >= 1"
                          type="submit"
                          class="bt btn-submit"
                        >
                          <span>发送</span>
                        </button>
                        <button v-else type="submit" class="bt btn-disabled">
                          <span>发送</span>
                        </button>
                      </t-form-item>
                    </t-form>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                item.statistics?.replyNumber > 0 &&
                moreReplayData[item.id]?.length !== item.statistics?.replyNumber
              "
              class="replyBoxBottom fx bg-wt"
            >
              <div
                class="bt-more btfx fx-ct"
                @click="handleLoadMoreReply(item)"
              >
                展开全部回复
                <img src="@/assets/test-img/icon_more@3x.png" alt="" />
              </div>
            </div>
            <div
              v-if="
                moreReplayData[item.id]?.length == item.statistics?.replyNumber
              "
              class="replyBoxBottom fx bg-wt"
            >
              <div
                class="bt-more btfx fx-ct"
                @click="handleRetractMoreReply(item)"
              >
                收起全部回复
                <img
                  src="@/assets/test-img/icon_more.png"
                  alt=""
                  class="retract"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loadData?.length < evaluateCount" class="boxBottom fx fx-ct bg-wt">
    <div class="bt-more bt" @click="handleLoadMore">点击查看更多</div>
  </div>
  <!-- 删除弹层 -->
  <Delete
    :dialog-delete-visible="dialogDeleteVisible"
    :delete-text="deleteText"
    @handle-delete="handleDelete"
    @handle-close="handleClose"
  ></Delete>
  <!-- 确认弹层 -->
  <Confirm
    :title="confirmTitle"
    :dialog-confirm-visible="dialogConfirmVisible"
    :confirm-text="confirmText"
    @handle-confirm="handleConfirm"
    @handle-close="handleClose"
  ></Confirm>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MessagePlugin, ValidateResultContext } from 'tdesign-vue-next'
import Delete from '@/components/Delete/index.vue' // 删除弹层
import Confirm from '@/components/Confirm/index.vue' // 确认弹层
// import { getEvaluationsList } from '@/api/list'
// import {
//   replayComments,
//   deleteComments,
//   deleteReply,
//   setTop,
//   getReplyList,
//   getEvaluateById,
//   setEvaluateSwitch
// } from '@/api/detail'
import { ImgList } from '@/utils/emoji/index'
import { loadDataType, MoreReplayDataType } from './type'

const title = ref('评论详情')
const data = ref({
  list: []
})
const route = useRoute()
const dialogDeleteVisible = ref(false) // 控制删除弹层显示隐藏
const deleteText = ref('此操作将永久删除这条信息，是否继续？') // 删除的内容
const dialogConfirmVisible = ref(false) // 控制确认弹层显示隐藏
const confirmText = ref('') // 确认的内容
const confirmTitle = ref('') // 确认的标题
const loadData = ref<Array<loadDataType>>([]) // 加载的数据
const moreReplayData = ref<MoreReplayDataType>({}) // 加载更多回复的数据
// 评论状态
const evaluationStatus = ref(true)
// 不点击加载更多但是重新获取列表时的请求数据
const requestListData = ref({})
// 当前回复框所在的list的数据
const list = ref({})
const showId = ref() // 当前显示的回复框的Id
// 请求参数
const { id } = route.params
const { targetType } = route.params
const evaluateCount = ref(0) // 评论总数
const targetTypeId = ref({
  targetTypeId: targetType
})
const requestData = ref({
  targetTypeId: targetTypeId.value.targetTypeId,
  targetId: id,
  sortBy: 1,
  scoreLevel: '',
  pageSize: 10,
  pageNo: 1,
  labelId: '',
  havePictures: '',
  haveAppend: ''
})
// 回复评论
const replyData = ref({
  ownerId: '',
  evaluationId: '',
  parentId: 0,
  isAnonymous: 0,
  content: '',
  pictureArray: []
})
// 请求更多回复的参数
const requestReplay = ref({
  evaluationId: '',
  pageNo: 1,
  pageSize: 0,
  sortBy: 1,
  targetTypeId: targetTypeId.value.targetTypeId
})
// 删除评论项的Id
const deleteId = ref()
// 删除评论项是评论还是回复
const deleteVal = ref()
// 置顶项的Id
const topId = ref('')
// 置顶项的状态（0：取消置顶，1：置顶）
const topVal = ref()
onMounted(() => {
  getData(requestData.value)
  title.value = localStorage.getItem('objectDetailTitle')
  getEvaluationStatus()
})
const replayValue = ref({
  content: ''
})

// 请求获取数据
const getData = async (val) => {
  // await getEvaluationsList(val)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       data.value = res.data
  //       evaluateCount.value = res.data.total
  //       loadData.value.push(...res.data.list)
  //     } else {
  //       console.log(res.msg)
  //     }
  //   })
  //   .catch((err) => {
  //     if (err === 'refreshToken') {
  //       getData(val)
  //     } else {
  //       console.log(err)
  //     }
  //   })
}
// 控制输入框的显示和隐藏
const handleContract = (val) => {
  if (val === showId.value) {
    handleCloseText()
    showId.value = ''
  } else {
    showId.value = val
    handleCloseText()
    const Contract = document.getElementById(val)
    Contract.style.display = 'block'
  }
}
// 关闭输入框
const handleCloseText = () => {
  replayValue.value.content = ''
  const ContractList = document.getElementsByClassName('Contract')
  for (let i = 0; i < ContractList.length; i++) {
    const Contract = ContractList[i] as HTMLElement
    Contract.style.display = 'none'
  }
}
// 校验规则
const rules = {
  content: [
    {
      required: true,
      message: '请输入回复内容',
      type: 'error',
      trigger: 'blur'
    },
    // {
    //   validator: (val) => {
    //     return (
        
    //     )
    //   },
    //   message: `请输入至少2个字符,至多个字符`,
    //   type: 'error',
    //   trigger: 'blur'
    // }
  ]
}
// 表单校验
// 回复评价校验
const evaluationRules = ref()
// 回复回复校验
const replyRules = ref()
const replyEvaluationId = ref('')
const replyOwnerId = ref('')
// 传递数据
const transferData = (item, eId?, oID?) => {
  list.value = item
  if (eId) {
    replyEvaluationId.value = eId
  }
  if (oID) {
    replyOwnerId.value = oID
  }
}
// 提交（一级评论）
const onSubmit = (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    handleReply(list.value)
  }
}
// 提交（二级评论）
const onSubmits = (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    handleReplys(list.value)
  }
}
// 回复评论(一级评论)
const handleReply = async (val) => {
  // 校验输入框的内容
  replyData.value.ownerId = val.ownerId
  replyData.value.evaluationId = val.id
  replyData.value.parentId = 0
  replyData.value.content = replayValue.value.content
  // await replayComments(targetTypeId.value.targetTypeId, replyData.value)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       MessagePlugin.success('回复成功')
  //       replayValue.value.content = ''
  //       getData(requestData.value)
  //       handleCloseText()
  //       handleLoadMoreReply(requestListData.value)
  //     } else {
  //       MessagePlugin.error(`${res.msg}`)
  //     }
  //   })
  //   .catch((err) => {
  //     if (err === 'refreshToken') {
  //       handleReply(val)
  //     } else {
  //       console.log(err)
  //     }
  //   })
}
// 回复评论（二级评论）
const handleReplys = async (val) => {
  // 校验输入框的内容
  if (val.ownerId) {
    replyData.value.ownerId = val.ownerId
  } else {
    replyData.value.ownerId = replyOwnerId.value
  }
  if (val.evaluationId) {
    replyData.value.evaluationId = val.evaluationId
  } else {
    replyData.value.evaluationId = replyEvaluationId.value
  }
  replyData.value.parentId = val.id
  replyData.value.content = replayValue.value.content
  // await replayComments(targetTypeId.value.targetTypeId, replyData.value)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       MessagePlugin.success('回复成功')
  //       // 情空输入框的内容
  //       replayValue.value.content = ''
  //       handleCloseText()
  //       getData(requestData.value)
  //       handleLoadMoreReply(requestListData.value)
  //     } else {
  //       MessagePlugin.error(`${res.msg}`)
  //     }
  //   })
  //   .catch((err) => {
  //     if (err === 'refreshToken') {
  //       handleReplys(val)
  //     } else {
  //       console.log(err)
  //     }
  //   })
}

// 点击加载更多
const handleLoadMore = () => {
  requestData.value.pageNo = Math.floor(requestData.value.pageSize / 10) // 页码,取整
  requestData.value.pageSize = 10
  requestData.value.pageNo += 1
  getData(requestData.value)
}
// 点击加载更多回复
const handleLoadMoreReply = (val) => {
  requestReplay.value.evaluationId = val.id
  requestListData.value = val
  requestReplay.value.pageSize += 100
  // getReplyList(requestReplay.value)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       moreReplayData.value[val.id] = res.data.list
  //     }
  //   })
  //   .catch((err) => {
  //     if (err === 'refreshToken') {
  //       handleLoadMoreReply(val)
  //     } else {
  //       console.log(err)
  //     }
  //   })
}
// 收起回复
const handleRetractMoreReply = (val) => {
  moreReplayData.value[val.id] = []
}

// 点击删除按钮
const handleDeleteBtn = (id, val) => {
  deleteId.value = id
  deleteVal.value = val
  if (val === 1) {
    deleteText.value = '此操作将永久删除这条评价，是否继续？'
  } else {
    deleteText.value = '此操作将永久删除这条回复，是否继续？'
  }
  // 因为确定删除和点击取消删除都会触发这个函数，所以需要判断一下
  dialogDeleteVisible.value = !dialogDeleteVisible.value
}

// 删除评论或者回复
const confirmDelete = async () => {
  // 删除评论
  if (deleteVal.value === 1) {
    // await deleteComments(deleteId.value, targetTypeId.value.targetTypeId)
    //   .then((res) => {
    //     if (res.code === 200) {
    //       loadData.value = []
    //       requestData.value.pageSize = requestData.value.pageNo * 10
    //       requestData.value.pageNo = 1
    //       getData(requestData.value)
    //       dialogDeleteVisible.value = false
    //       handleCloseText()
    //       MessagePlugin.success('删除成功')
    //     } else {
    //       MessagePlugin.error(`${res.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       confirmDelete()
    //     } else {
    //       console.log(err)
    //     }
    //   })
  } else {
    // await deleteReply(deleteId.value, targetTypeId.value.targetTypeId)
    //   .then((res) => {
    //     if (res.code === 200) {
    //       getData(requestData.value)
    //       handleLoadMoreReply(requestListData.value)
    //       dialogDeleteVisible.value = false
    //       handleCloseText()
    //       MessagePlugin.success('删除成功')
    //     } else {
    //       MessagePlugin.error(`${res.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       confirmDelete()
    //     } else {
    //       console.log(err)
    //     }
    //   })
  }
}
// 确认删除
const handleDelete = () => {
  confirmDelete()
}

// 点击置顶或者取消置顶
const handleSetTop = (id, top) => {
  topId.value = id
  topVal.value = top
  if (top === 0) {
    confirmTitle.value = '置顶评价'
    confirmText.value = '此操作将置顶这条评价，是否继续？'
  } else {
    confirmTitle.value = '取消置顶'
    confirmText.value = '此操作将取消置顶这条评价，是否继续？'
  }
  dialogConfirmVisible.value = !dialogConfirmVisible.value
}

// 发送置顶或者取消置顶请求
const confirmSetTop = async () => {
  if (topVal.value === 0) {
    // await setTop(topId.value, 1, targetType)
    //   .then((res) => {
    //     if (res.data.code === 200) {
    //       getData(requestData.value)
    //       dialogConfirmVisible.value = false
    //       MessagePlugin.success('置顶成功')
    //       moreReplayData.value = {}
    //     } else {
    //       MessagePlugin.error(`${res.data.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       confirmSetTop()
    //     } else {
    //       console.log(err)
    //     }
    //   })
  } else {
    // await setTop(topId.value, 0, targetType)
    //   .then((res) => {
    //     if (res.data.code === 200) {
    //       getData(requestData.value)
    //       dialogConfirmVisible.value = false
    //       MessagePlugin.success('取消置顶成功')
    //       moreReplayData.value = {}
    //     } else {
    //       MessagePlugin.error(`${res.data.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       confirmSetTop()
    //     } else {
    //       console.log(err)
    //     }
    //   })
  }
}

// 确认置顶或者取消置顶,确认关闭或者开启评价
const handleConfirm = () => {
  if (confirmTitle.value === '关闭评价' || confirmTitle.value === '开启评价') {
    confirmComments()
  } else {
    confirmSetTop()
  }
}

// 关闭弹窗
const handleClose = () => {
  dialogDeleteVisible.value = false // 关闭删除弹层
  dialogConfirmVisible.value = false // 关闭置顶弹层
}

// 处理表情
// emoji
const handleEmoji = (content) => {
  if (!content) return content
  let newContent = content
  const regex = /\[([\u4e00-\u9fa5]+)\]/g

  const match = newContent.match(regex)
  // 符合正则 则将对应的表情的特定字符转为图片
  if (regex.test(newContent)) {
    match.forEach((item) => {
      const arr = ImgList.filter((item1) => item1.id === item)
      if (arr.length) {
        newContent = newContent.replace(
          item,
          `<img data-v-1fd959d1="" width="20" height="20" src="${
            ImgList.filter((item1) => item1.id === item)[0].src
          }" alt="" class="emoji-icon" style="vertical-align: text-top;">`
        )
      }
    })
  }
  return newContent
}

// 根据id查询是否可评价
const getEvaluationStatus = async () => {
  const EvaluationStatus = ref({
    targetTypeId: targetType,
    targetId: id
  })
  // await getEvaluateById(EvaluationStatus.value).then((res) => {
  //   evaluationStatus.value = res.data
  // })
}

// 点击评价或者关闭评价
const handleComments = (val) => {
  if (val) {
    confirmTitle.value = '关闭评价'
    confirmText.value = '此操作将关闭评价，是否继续？'
    dialogConfirmVisible.value = !dialogConfirmVisible.value
  } else {
    confirmTitle.value = '开启评价'
    confirmText.value = '此操作将开启评价，是否继续？'
    dialogConfirmVisible.value = !dialogConfirmVisible.value
  }
}

// 确认关闭评价或开启评价
const confirmComments = async () => {
  const flag = !evaluationStatus.value
  // await setEvaluateSwitch(targetType, id, flag)
  //   .then((res) => {
  //     if (res.data.code === 200) {
  //       MessagePlugin.success('操作成功')
  //       dialogConfirmVisible.value = false
  //       getEvaluationStatus()
  //     } else {
  //       MessagePlugin.error(`${res.data.msg}`)
  //     }
  //   })
  //   .catch((err) => {
  //     if (err === 'refreshToken') {
  //       confirmComments()
  //     } else {
  //       console.log(err)
  //     }
  //   })
}
</script>

<style lang="less" scoped>
.detail-comment {
  padding: 38.2px 48px 32.3px 36px;
  border-radius: 2px 2px 0 0;
  .name {
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    font-size: 15px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    margin-left: 6.3px;
    .name {
      font-family: PingFangSC-SNaNpxibold;
      font-weight: 600;
      font-size: 18px;
      color: var(--color-bk2);
    }
  }
  .allReply {
    margin-top: 20px;
  }
  .comment {
    margin-top: 35.7px;
    padding-bottom: 10px;
    .title {
      font-size: 16px;
      color: var(--color-bk3);
      border-bottom: 1px solid #000;
      padding-left: 20px;
      padding-right: 20px;
    }
    .body {
      .card1 {
        padding-left: 20px;
        padding-right: 16px;
        box-sizing: border-box;
        display: flex;
        border-bottom: 1px solid #ebeef5;
        margin-bottom: 31.3px;
        padding-bottom: 13.5px;
        &:last-child {
          border: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .left1 {
          img {
            width: 42px;
            height: 42px;
            border-radius: 50%;
          }
          margin-right: 9.3px;
        }
        .right1 {
          width: 100%;
        }
        .user {
          font-size: 14px;
          color: var(--color-bk3);
          font-family: PingFangSC-SNaNpxibold;
          font-weight: 600;
          height: 20px;
          span {
            margin-right: 5px;
            margin-left: 5px;
            font-weight: 600;
            font-size: 14px;
            color: var(--color-bk4);
          }
        }
        .content {
          margin-top: 5.2px;
          font-size: 14px;
          line-height: 24px;
          color: var(--color-bk3);
          .Top {
            background: #39d395;
            border-radius: 2px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 13px;
            color: #ffffff;
            letter-spacing: 2px;
            padding: 1px 7px;
            margin-right: 3px;
          }
        }
        .foot1 {
          display: flex;
          justify-content: space-between;
          margin-top: 21px;
          margin-bottom: 15px;
          span {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 12px;
            color: #58637d;
          }
          .operation {
            display: flex;
            div {
              display: flex;
              cursor: pointer;
              color: var(--color-bk3);
              span {
                height: 20px;
              }
            }
            .like {
              pointer-events: none;
              div {
                height: 20px;
                margin-right: 3.5px;
                // background-image: url('@/assets/btn_zan_nor@3x.png');
                // background-repeat: no-repeat;
                // background-size: 100% 100%;
              }
              margin-right: 34.3px;
            }
            .reply {
              div {
                width: 20px;
                height: 20px;
                margin-right: 3.5px;
                background-image: url('@/assets/btn_pinglun_nor.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
              }
              &:hover {
                div {
                  background-image: url('@/assets/btn_pinglun_hover.png');
                }
                span {
                  color: var(--color-main);
                }
              }
              margin-right: 34.3px;
            }
            .setTop {
              margin-right: 34.3px;
              div {
                width: 20px;
                height: 20px;
                margin-right: 3.5px;
                background-image: url('@/assets/btn_tuijian_nor.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
              }
              &:hover {
                div {
                  background-image: url('@/assets/btn_zhiding_nor.png');
                }
                span {
                  color: var(--color-main);
                }
              }
            }
            .delete {
              margin-right: 16px;
              div {
                width: 20px;
                height: 20px;
                margin-right: 3.5px;
                background-image: url('@/assets/btn_delete_nor.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
              }
              &:hover {
                div {
                  background-image: url('@/assets/btn_delete_hover.png');
                }
                span {
                  color: var(--color-main);
                }
              }
            }
          }
        }
        .Contract {
          padding-top: 7px;
          padding-right: 17px;
          padding-bottom: 15px;
          overflow: auto;
          display: none;
          .btn-submit {
            height: 36px;
            text-align: center;
            line-height: 36px;
            position: absolute;
            right: 15px;
            width: 80px;
            top: 91px;
          }
          .btn-disabled {
            height: 36px;
            text-align: center;
            line-height: 36px;
            position: absolute;
            right: 15px;
            width: 80px;
            top: 91px;
            background: #f3f4f7;
            border-radius: 4px;
            // 禁止点击
            pointer-events: none;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            color: var(--color-bk4);
          }
        }
        .card2 {
          .box {
            display: flex;
            &:first-child {
              padding-top: 14.4px;
            }
            .left2 {
              margin-left: 11.1px;
              margin-right: 7.5px;
              img {
                width: 30px;
                height: 30px;
                border-radius: 50%;
              }
            }
            .right2 {
              width: 100%;
            }
            .foot2 {
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
              margin-bottom: 30px;
              span {
                font-family: PingFangSC-Regular;
                font-weight: 400;
                font-size: 12px;
                color: #58637d;
              }
              .operation {
                display: flex;
                .like {
                  pointer-events: none;
                  div {
                    height: 20px;
                    margin-right: 3.5px;
                    // background-image: url('@/assets/btn_zan_nor@3x.png');
                    // background-repeat: no-repeat;
                    // background-size: 100% 100%;
                  }
                  margin-right: 34.3px;
                }
                div {
                  display: flex;
                  cursor: pointer;
                  color: var(--color-bk3);
                  span {
                    height: 20px;
                  }
                }
                .reply {
                  div {
                    width: 20px;
                    height: 20px;
                    margin-right: 3.5px;
                    background-image: url('@/assets/btn_pinglun_nor.png');
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                  }
                  &:hover {
                    div {
                      background-image: url('@/assets/btn_pinglun_hover.png');
                    }
                    span {
                      color: var(--color-main);
                    }
                  }
                  margin-right: 34.3px;
                }
                .delete {
                  margin-right: 16px;
                  div {
                    width: 20px;
                    height: 20px;
                    margin-right: 3.5px;
                    background-image: url('@/assets/btn_delete_nor.png');
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                  }
                  &:hover {
                    div {
                      background-image: url('@/assets/btn_delete_hover.png');
                    }
                    span {
                      color: var(--color-main);
                    }
                  }
                }
              }
            }
          }
        }
        .replyBoxBottom {
          // margin-left: 48.6px;
          .bt-more {
            color: var(--color-main);
            cursor: pointer;
            img {
              width: 10px;
              height: 10px;
              margin-left: 4px;
              margin-bottom: 2px;
            }
            .retract {
              margin-top: 3px;
            }
            &:hover {
              color: var(--color-main);
            }
          }
        }
      }
    }
  }
}
.bt {
  width: 88px;
  height: 32px;
}
.line {
  padding: 0 7.5px;
}
.boxBottom {
  padding-top: 32px;
  padding-bottom: 32px;
  border-top: 1px solid var(--color-border);
  border-radius: 0 0 2px 2px;
  .bt-more {
    background: transparent;
    color: var(--color-main);
    &:hover {
      background: transparent;
    }
  }
}
.commentText {
  border: 1px solid #d8dde3;
  border-radius: 4px;
  height: 142px;
  position: relative;
  :deep(.t-textarea__inner) {
    border: 0;
    box-shadow: none;
    padding-left: 15px;
    padding-top: 15px;
    &:focus {
      box-shadow: none;
    }
  }
}
:deep(.t-input__extra) {
  position: initial;
}
:deep(.t-textarea__limit) {
  display: none;
}
</style>
