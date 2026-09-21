<template>
  <div class="detail-base bg-wt">
    <div class="title">业务信息</div>
    <div class="headBox">
      <div class="form">
        <div class="card">
          <div class="name">评价对象编号</div>
          <div class="contents">{{ detailData.targetId }}</div>
        </div>
      </div>
      <!-- <div class="form">
        <div class="card">
          <div class="name">下单时间</div>
          <div class="contents">{{ detailData.createTime }}</div>
        </div>
      </div>
      <div class="form">
        <div class="card">
          <div class="name">更新时间</div>
          <div class="contents">{{ detailData.updateTime }}</div>
        </div>
      </div> -->
      <div class="form">
        <div class="card">
          <div class="name">评价对象</div>
          <div class="contents">{{ detailData.targetName }}</div>
        </div>
      </div>
      <div class="form">
        <div class="card">
          <div class="name">评价评分</div>
          <div class="contents">{{ detailData.totalScore }}分</div>
        </div>
      </div>
      <div class="form">
        <div class="card">
          <div class="name">发布人编号</div>
          <div class="contents">{{ detailData.evaluatorId }}</div>
        </div>
      </div>
      <!-- <div class="form">
        <div class="card">
          <div class="name">评价人</div>
          <div class="contents">{{ detailData.evaluatorInfo?.nickName }}</div>
        </div>
      </div> -->
    </div>
  </div>
  <div class="contentBody bg-wt">
    <div class="title">评价信息</div>
    <div class="detail">
      <div class="detailHead">
        <div class="user">
          <img
            v-if="detailData.evaluatorInfo?.avatar"
            :src="detailData.evaluatorInfo?.avatar"
            alt=""
          />
          <img v-else src="../../../assets/head@3x.png" alt="" />
          <div>{{ detailData.evaluatorInfo?.nickName }}</div>
        </div>
        <div class="op">
          <div class="orderStar">
            <t-rate
              :default-value="
                detailData.totalScore % 1 !== 0
                  ? Math.floor(detailData.totalScore) + 0.5
                  : detailData.totalScore
              "
              allow-half
              disabled
              size="16px"
              :gap="6"
              color="#FF4C4C"
              class="stars"
            />
            <span>{{ detailData.totalScore }}分</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="body">
          <span v-html="handleEmoji(detailData.content)"></span>
        </div>
        <div v-if="detailData.pictureArray" class="picture">
          <t-image-viewer
            v-if="detailData.pictureArray.length > 0"
            :images="detailData.pictureArray"
          >
            <template #trigger="{ open }">
              <div class="tdesign-demo-image-viewer__ui-image">
                <img
                  alt="test"
                  :src="detailData.pictureArray[0]"
                  class="tdesign-demo-image-viewer__ui-image--img"
                />
                <div
                  class="tdesign-demo-image-viewer__ui-image--hover"
                  @click="open"
                ></div>
              </div>
            </template>
          </t-image-viewer>
        </div>
        <div class="top">
          <div class="orderStar">
            <div class="time">
              {{ detailData.createTime }}
            </div>
          </div>
          <div class="op">
            <div class="setTop" @click="handleClickSetTop(detailData)">
              <div></div>
              <span>{{ detailData.isTop == 0 ? '置顶' : '取消置顶' }}</span>
            </div>
            <div class="delete" @click="handleClickDelete(detailData)">
              <div></div>
              <span>删除</span>
            </div>
          </div>
        </div>
        <div class="card2">
          <div v-for="(content, num) in replayAllData" :key="num" class="box">
            <div class="left2">
              <img
                v-if="content.replierInfo?.avatar"
                :src="content.replierInfo?.avatar"
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
                  <!-- <div class="like">
                    <div></div>
                    <span>{{
                      item.statistics?.likeNumber
                        ? item.statistics?.likeNumber
                        : 0
                    }}</span>
                  </div> -->
                  <div class="delete" @click="handleDeleteBtn(content.id, 2)">
                    <div></div>
                    <span>删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="detailData.statistics?.replyNumber > 5"
            class="replyBoxBottom fx bg-wt"
          >
            <div class="bt-more btfx fx-ct" @click="handleLoadMoreReply()">
              展开全部回复
              <img src="@/assets/test-img/icon_more@3x.png" alt="" />
            </div>
          </div>
          <div
            v-if="
              replayAllData?.length == detailData.statistics?.replyNumber &&
              replayAllData?.length > 5
            "
            class="replyBoxBottom fx bg-wt"
          >
            <div class="bt-more btfx fx-ct" @click="handleRetractMoreReply()">
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
    <div class="reply bg-wt">
      <div class="head">回复评价</div>
      <div class="body">
        <t-form
          ref="form"
          :data="formData"
          :rules="rules"
          :label-width="0"
          on-cancel="onClickCloseBtn"
          @submit="onSubmit"
        >
          <t-form-item name="content"
            ><t-textarea
              v-model="formData.content"
              class="word"
              placeholder="请输入至少5个字符"
            >
            </t-textarea>
          </t-form-item>
          <t-form-item>
            <span class="fastReply">快速回复:</span>
            <div class="tip">
              <span @click="transferText('您的认可是我们最大的欣慰')"
                >您的认可是我们最大的欣慰</span
              >
              <span @click="transferText('对于您的反馈，我们会认真考虑')"
                >对于您的反馈，我们会认真考虑</span
              >
            </div>
          </t-form-item>
          <t-form-item class="submit">
            <button type="submit" :class="`bt btn-submit bt-disabled`">
              <span>回复</span>
            </button>
            <span class="bt-tip">注意：管理员回复内容会在前台显示</span>
          </t-form-item>
        </t-form>
      </div>
    </div>
  </div>

  <div class="boxBottom fx fx-ct bg-wt">
    <div class="bt-back bt" @click="handleReturn">返回</div>
  </div>
  <!-- 删除弹层 -->
  <Delete
    :dialog-delete-visible="dialogDeleteVisible"
    :delete-text="deleteText"
    @handle-delete="handleDelete"
    @handle-close="handleClose"
  ></Delete>
  <!-- 确认置顶弹层 -->
  <Confirm
    :title="confirmTitle"
    :dialog-confirm-visible="dialogConfirmVisible"
    :confirm-text="confirmText"
    @handle-confirm="handleConfirm"
    @handle-close="handleClose"
  ></Confirm>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { MessagePlugin, ValidateResultContext } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
// import {
//   getCommentsDetail,
//   replayComments,
//   deleteComments,
//   setTop,
//   getReplyList,
//   deleteReply
// } from '@/api/detail'
// import { useValidateStore, useObjectTypeStore } from '@/store'
import { ImgList } from '@/utils/emoji/index'
import Confirm from '@/components/Confirm/index.vue' // 确认弹层
import Delete from '@/components/Delete/index.vue' // 删除弹层
import { DetailDataType } from './type'

const route = useRoute()
const router = useRouter()
const dialogDeleteVisible = ref(false) // 控制删除弹层显示隐藏
const deleteText = ref('此操作将永久删除这条评价，是否继续？') // 删除的内容
const deleteData = ref({} as DetailDataType)
// 要删除的数据
const setTopData = ref({} as DetailDataType) // 要置顶的数据
const confirmText = ref('') // 确认的内容
const confirmTitle = ref('') // 确认的标题
const dialogConfirmVisible = ref(false) // 控制确认弹层显示隐藏

// 请求参数
const { id } = route.params
const { targetType } = route.params
const targetTypeId = ref({
  targetTypeId: targetType
})
const deleteId = ref(0) // 删除类型id
const deleteVal = ref() // 删除类型值id
const replayAllData = ref([]) // 全部回复数据
// const replyContentWordNum = ref(
//   validateStore.validateNum.targetType.replyContentWordNum
// ) // 回复内容字数
// 详情数据
const detailData = ref({} as DetailDataType)
// 回复评论
const replyData = ref({
  ownerId: '',
  evaluationId: '',
  parentId: 0,
  isAnonymous: 0,
  content: '',
  pictureArray: []
})
// 请求回复的参数
const requestReplay = ref({
  evaluationId: '',
  pageNo: 1,
  pageSize: 0,
  sortBy: 1,
  targetTypeId: targetTypeId.value.targetTypeId
})
// 获取详情数据
// const getDetailData = async () => {
//   await getCommentsDetail(id, targetTypeId.value)
//     .then((res) => {
//       if (res.code === 200) {
//         detailData.value = res.data
//         // blackStarNum.value的值为5 - detailData.totalScore
//         blackStarNum.value = 5 - detailData.value.totalScore
//       }
//     })
//     .catch((err) => {
//       if (err === 'refreshToken') {
//         getDetailData()
//       } else {
//         console.log(err)
//       }
//     })
// }
// 获取回复数据
// 点击加载更多回复
const getReplayData = async () => {
  requestReplay.value.evaluationId = id.toString()
  if (requestReplay.value.pageSize === 0) {
    requestReplay.value.pageSize = 5
  } else {
    requestReplay.value.pageSize += 100
  }
  // await getReplyList(requestReplay.value)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       replayAllData.value = res.data.list
  //     }
  //   })
  //   .catch((err) => {
  //     if (err === 'refreshToken') {
  //       getReplayData()
  //     } else {
  //       console.log(err)
  //     }
  //   })
}
// 黑色分分的数量
const blackStarNum = ref(0)
// 生命周期
onMounted(() => {
  // getDetailData()
  getReplayData()
})
const formData = ref({
  content: ''
})

const handleReturn = () => {
  window.history.go(-1)
}
const rules = {
  content: [
    {
      required: true,
      message: '请输入回复内容',
      type: 'error',
      trigger: 'blur'
    },
    {
      validator: (val) => {},
      message: `请输入至少2个字符,至多个字符`,
      type: 'error',
      trigger: 'blur'
    }
  ]
}
// 提交
const onSubmit = async (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    replyData.value.content = formData.value.content
    replyData.value.evaluationId = String(id)
    replyData.value.ownerId = detailData.value.ownerId

    // await replayComments(targetTypeId.value.targetTypeId, replyData.value)
    //   .then((res) => {
    //     if (res.code === 200) {
    //       MessagePlugin.success('回复成功')
    //       formData.value.content = ''
    //       getDetailData()
    //     } else {
    //       MessagePlugin.error(`回复失败：${res.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       onSubmit(result)
    //     } else {
    //       console.log(err)
    //     }
    //   })
  }
}
// 关闭弹窗
const handleClose = () => {
  dialogDeleteVisible.value = false // 关闭删除弹层
  dialogConfirmVisible.value = false // 关闭确认弹层
}
// 点击删除
const handleClickDelete = (row) => {
  deleteText.value = '此操作将永久删除这条评价，是否继续？'
  deleteData.value = row
  dialogDeleteVisible.value = true
}
// 确认删除
const handleDelete = async () => {
  // 删除评论
  if (deleteVal.value !== 2) {
    // await deleteComments(id, targetTypeId.value.targetTypeId)
    //   .then((res) => {
    //     if (res.code === 200) {
    //       dialogDeleteVisible.value = false
    //       MessagePlugin.success('删除成功')
    //       getDetailData()
    //       router.push({
    //         path: `/replay/order`
    //       })
    //     } else {
    //       MessagePlugin.error(`删除失败：${res.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       handleDelete()
    //     } else {
    //       console.log(err)
    //     }
    //   })
  }
  // 删除回复
  else {
    // await deleteReply(deleteId.value, targetTypeId.value.targetTypeId)
    //   .then((res) => {
    //     if (res.code === 200) {
    //       getDetailData()
    //       if (requestReplay.value.pageSize < 100) {
    //         requestReplay.value.pageSize = 0
    //       }
    //       handleLoadMoreReply()
    //       dialogDeleteVisible.value = false
    //       MessagePlugin.success('删除成功')
    //     } else {
    //       MessagePlugin.error(`删除失败：${res.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       handleDelete()
    //     } else {
    //       console.log(err)
    //     }
    //   })
  }
}
// 点击置顶
const handleClickSetTop = (row) => {
  setTopData.value = row
  if (setTopData.value.isTop === 0) {
    confirmTitle.value = '置顶评价'
    confirmText.value = '此操作将置顶这条评价，是否继续？'
  } else {
    confirmTitle.value = '取消置顶'
    confirmText.value = '此操作将取消置顶这条评价，是否继续？'
  }
  dialogConfirmVisible.value = true
}
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
// 确认置顶
const handleConfirm = async () => {
  if (setTopData.value.isTop === 0) {
    // await setTop(id, 1, targetTypeId.value.targetTypeId)
    //   .then((res) => {
    //     if (res.data.code === 200) {
    //       dialogConfirmVisible.value = false
    //       MessagePlugin.success('置顶成功')
    //       getDetailData()
    //     } else {
    //       MessagePlugin.error(`置顶失败：${res.data.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       handleConfirm()
    //     } else {
    //       console.log(err)
    //     }
    //   })
  } else {
    // await setTop(id, 0, targetTypeId.value.targetTypeId)
    //   .then((res) => {
    //     if (res.data.code === 200) {
    //       getDetailData()
    //       dialogConfirmVisible.value = false
    //       MessagePlugin.success('取消置顶成功')
    //     } else {
    //       MessagePlugin.error(`取消置顶失败：${res.data.msg}`)
    //     }
    //   })
    //   .catch((err) => {
    //     if (err === 'refreshToken') {
    //       handleConfirm()
    //     } else {
    //       console.log(err)
    //     }
    //   })
  }
}
// 加载更多回复
const handleLoadMoreReply = () => {
  getReplayData()
}
// 收起全部回复
const handleRetractMoreReply = () => {
  replayAllData.value = replayAllData.value.slice(0, 5)
}
// 删除回复
const handleDeleteBtn = (id, val) => {
  deleteId.value = id
  deleteVal.value = val
  deleteText.value = '此操作将永久删除这条回复，是否继续？'
  // 因为确定删除和点击取消删除都会触发这个函数，所以需要判断一下
  dialogDeleteVisible.value = !dialogDeleteVisible.value
}
// 点击传递文字至输入框
const transferText = (text) => {
  formData.value.content = text
}
</script>

<style lang="less" scoped>
.detail-base {
  padding: 26.3px 40px 14px 40px;

  .title {
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 18px;
    color: #20232a;
    padding-bottom: 22.6px;
  }

  :deep(.t-card) {
    padding: 8px;
  }

  .headBox {
    display: flex;
    // 一行显示3个
    flex-wrap: wrap;

    .form {
      width: 45.1%;

      .card {
        display: flex;
        margin-bottom: 26px;

        .name {
          width: 42.7%;
          color: var(--color-bk3);
        }

        .contents {
          width: 57.3%;
          color: var(--color-bk1);
        }
      }
    }
  }

  :deep(.t-card__title) {
    font-size: 20px;
    font-weight: 500;
  }

  &-info-steps {
    padding-top: 12px;
  }

  .tips {
    background-color: var(--color-bk7);
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
  }
}

.contentBody {
  padding: 30px 40px 30px 40px;
  margin-top: 20px;

  .title {
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 18px;
    color: #20232a;
  }

  .detail {
    padding-top: 26px;
    padding-bottom: 23px;
    border-bottom: 1px solid var(--color-border);

    .detailHead {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .user {
        display: flex;

        img {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          margin-right: 9px;
        }

        div {
          // 文字垂直居中
          line-height: 26px;
          height: 26px;
          font-family: PingFangSC-SNaNpxibold;
          font-weight: 600;
          font-size: 14px;
          color: var(--color-bk1);
          letter-spacing: 0;
        }
      }

      .op {
        display: flex;
        .orderStar {
          display: flex;
          align-items: center;
          color: var(--color-bk3);
          span {
            font-weight: 400;
            font-size: 14px;
            margin-left: 8px;
            line-height: 24px;
          }

          .stars {
            display: flex;
            align-items: flex-end;

            .star {
              margin-right: 5.5px;
              width: 16px;
              height: 16px;
            }
          }
          .time {
            height: 20px;
            line-height: 20px;
          }
        }
      }
    }

    .content {
      flex: 1;
      margin-left: 35px;

      .top {
        height: 20px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;

        .orderStar {
          display: flex;
          align-items: center;
          color: var(--color-bk3);
          span {
            font-weight: 400;
            font-size: 14px;
            margin-right: 8px;
            line-height: 24px;
          }

          .stars {
            display: flex;
            align-items: flex-end;
            margin-right: 28px;

            .star {
              margin-right: 5.5px;
              width: 16px;
              height: 16px;
            }
          }
          .time {
            height: 20px;
            line-height: 20px;
          }
        }
        .op {
          display: flex;
          div {
            display: flex;
            cursor: pointer;
            color: var(--color-bk3);
            &:hover {
              color: var(--color-main);
            }

            span {
              height: 20px;
              line-height: 20px;
            }

            &:first-child {
              margin-right: 33.3px;
            }
          }
          .setTop {
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
            }
          }
          .delete {
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
            }
          }
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
            .user {
              font-family: PingFangSC-SNaNpxibold;
              font-weight: 600;
              font-size: 14px;
              color: var(--color-bk1);
            }
            .content {
              margin-left: 0;
              margin-top: 5.2px;
              font-size: 14px;
              line-height: 24px;
              color: var(--color-bk3);
            }
          }
          .foot2 {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            margin-bottom: 30px;
            color: var(--color-bk3);
            &:last-child {
              margin-bottom: 10px;
            }
            span {
              font-family: PingFangSC-Regular;
              font-weight: 400;
              font-size: 12px;
            }
            .operation {
              display: flex;
              .like {
                pointer-events: none;
                div {
                  width: 20px;
                  height: 20px;
                  margin-right: 3.5px;
                  background-image: url('@/assets/btn_zan_nor@3x.png');
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                }
                margin-right: 34.3px;
              }
              div {
                display: flex;
                cursor: pointer;
                color: var(--color-bk3);
                span {
                  height: 20px;
                  line-height: 20px;
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
                span {
                  font-size: 14px;
                }
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
        margin-left: 48.6px;
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
        }
      }
      .body {
        margin-bottom: 22px;
        font-size: 14px;
        color: var(--color-bk3);
        line-height: 22px;
      }
    }
  }

  .reply {
    padding-top: 21.7px;
    padding-left: 43px;
    padding-bottom: 26px;
    margin-left: 20px;
    // 居中
    margin: 0 auto;

    .head {
      height: 20px;
      font-family: PingFangSC-SNaNpxibold;
      font-weight: 600;
      font-size: 14px;
      color: var(--color-bk3);
    }

    .body {
      padding-top: 16.3px;
      width: 70.3%;

      :deep(.t-form__item) {
        margin-bottom: 20px;
      }

      :deep(.t-textarea__inner) {
        height: 84px;
      }
    }
  }
}
.fastReply {
  margin-right: 10px;
}
.disabled {
  span {
    // 不可点击变，鼠标变箭头
    cursor: no-drop;
    pointer-events: none;
  }
}
.tip {
  display: flex;
  width: 400px;
  font-size: 12px;

  span {
    margin-right: 10px;
    background-color: #e7e7e7;
    color: var(--color-bk3);
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 3px;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
  }
}

.bt {
  width: 60px;
  height: 32px;
  margin-right: 14.5px;
}

.bt-tip {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 14px;
  color: var(--color-bk3);
}

.boxBottom {
  padding-top: 32px;
  padding-bottom: 32px;
  border-top: 1px solid var(--color-border);
  border-radius: 0 0 2px 2px;
}

:deep(.t-form__controls) {
  min-height: 0;

  :deep(.t-form__controls-content) {
    min-height: 0;
  }
}

.submit {
  margin-bottom: 0 !important;
  margin-top: 5px !important;
}

.bt-back {
  width: 88px;
}

:deep(.t-input__extra) {
  position: initial;
}

:deep(.t-form__controls-content) {
  min-height: 0;
}
:deep(.t-textarea__limit) {
  background: transparent;
}
:deep(.t-rate__item) {
  // hover不变化大小
  transform: scale(1);
}
.picture {
  margin-bottom: 22px;
}
</style>
