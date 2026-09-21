export interface loadDataType {
  id: string
  evaluatorInfo: {
    avatar: string
    nickName: string
  }
  isTop: number
  content: string
  createTime: string
  statistics?: {
    replyNumber: number
  }
  replyArray: Array<{
    replierInfo: {
      avatar: string
      nickName: string
    }
    targetReplierInfo: {
      nickName: string
    }
    parentId: string | number
    content: string
    createTime: string
    replierId: number
    id: string
  }>
}
// 定义一个对象的类型，第一层是对象，第二层是数组，第三层是对象，第一层的对象名字不确定可以是任意的字符串，第二层没有名字
export interface MoreReplayDataType {
  [key: string]: Array<{
    avatar: any
    nickName: any
    id: string
    createTime: string
    content: string
    evaluationId: string
    hotScore: string
    ownerId: string
    parentId: string | number
    pictureArray: Array<{}>
    replierId: string
    updateTime: string
    replierInfo: {
      avatar: string
      nickName: string
      isAnonymous: number
    }
    targetReplierId: string
    targetReplierInfo: {
      avatar: string
      nickName: string
      isAnonymous: number
    }
  }>
}
// 定义详情数据的类型
export interface DetailDataType {
  appendArray: Array<{}> // 追加评价
  content: string // 评价内容
  createTime: string // 评价时间
  evaluatorId: string // 评价人id
  evaluatorInfo: {
    avatar: string
    nickName: string
    isAnonymous: number
  } // 评价人信息
  hotScore: number // 评价评分
  id: string // 评价id
  isTop: number // 是否置顶
  labelIdArray: Array<{}> // 评价标签
  ownerId: string // 评价对象id
  pictureArray: Array<string> // 评价图片
  province: string // 评价人省份
  scoreArray: Array<{
    itemId: string
    score: number
    itemName: string
  }> // 评价评分
  scoreLevel: number // 评价评分
  statistics: {
    replyNumber: number
    likeNumber: number
    qualityScore
  }
  targetId: string // 评价对象id
  targetName: string // 评价对象名称
  totalScore: number // 评价评分
  updateTime: string // 评价更新时间
}
// 分页
export interface paginationType {
  pageSizeOptions?: Array<number>
  defaultPageSize?: number
  total?: number
  defaultCurrent?: number // 默认当前页
  infoType?: number
  targetType?: number
}
export interface dataType {
  [x: string]: any
  [key: number]: Array<{
    appendArray: Array<{}> // 追加评价
    content: string // 评价内容
    createTime: string // 评价时间
    evaluatorId: string // 评价人id
    evaluatorInfo: {
      avatar: string
      nickName: string
      isAnonymous: number
    } // 评价人信息
    hotScore: number // 评价评分
    id: string // 评价id
    isTop: number // 是否置顶
    labelIdArray: Array<{}> // 评价标签
    ownerId: string // 评价对象id
    pictureArray: Array<string> // 评价图片
    province: string // 评价人省份
    scoreArray: Array<{
      itemId: string
      score: number
      itemName: string
    }> // 评价评分
    scoreLevel: number // 评价评分
    statistics: {
      replyNumber: number
      likeNumber: number
      qualityScore
    }
    targetId: string // 评价对象id
    targetName: string // 评价对象名称
    totalScore: number // 评价评分
    updateTime: string // 评价更新时间
  }>
}
