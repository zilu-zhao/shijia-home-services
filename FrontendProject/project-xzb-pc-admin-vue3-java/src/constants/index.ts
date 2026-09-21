// 合同状态枚举
export const CONTRACT_STATUS = {
  FAIL: 0,
  AUDIT_PENDING: 1,
  EXEC_PENDING: 2,
  EXECUTING: 3,
  FINISH: 4
}

export const CONTRACT_STATUS_OPTIONS = [
  { value: CONTRACT_STATUS.FAIL, label: '审核失败' },
  { value: CONTRACT_STATUS.AUDIT_PENDING, label: '待审核' },
  { value: CONTRACT_STATUS.EXEC_PENDING, label: '待履行' },
  { value: CONTRACT_STATUS.EXECUTING, label: '审核成功' },
  { value: CONTRACT_STATUS.FINISH, label: '已完成' }
]

// 合同类型枚举
export const CONTRACT_TYPES = {
  MAIN: 0,
  SUB: 1,
  SUPPLEMENT: 2
}

export const CONTRACT_TYPE_OPTIONS = [
  { value: CONTRACT_TYPES.MAIN, label: '主合同' },
  { value: CONTRACT_TYPES.SUB, label: '子合同' },
  { value: CONTRACT_TYPES.SUPPLEMENT, label: '补充合同' }
]

// 合同收付类型枚举
export const CONTRACT_PAYMENT_TYPES = {
  PAYMENT: 0,
  RECEIPT: 1
}

// 通知的优先级对应的TAG类型
export const NOTIFICATION_TYPES = {
  low: 'primary',
  middle: 'warning',
  high: 'danger'
}
// 状态
export const STATUS = [
  { value: 0, label: '禁用' },
  { value: 1, label: '启用' }
]
// 服务项状态
export const SERVICE_STATUS = [
  { value: 0, label: '草稿' },
  { value: 1, label: '禁用' },
  { value: 2, label: '启用' }
]
export const STATU = [
  { value: 0, label: '上架' },
  { value: 1, label: '下架' }
]
// 单位
export const UNIT = [
  { value: 1, label: '小时' },
  { value: 2, label: '天' },
  { value: 3, label: '次' },
  { value: 4, label: '台' },
  { value: 5, label: '个' },
  { value: 6, label: '㎡' },
  { value: 7, label: '米' }
]
// 冻结时间
export const FREEZE_TIME = [
  { value: 0, label: '3天' },
  { value: 1, label: '7天' },
  { value: 2, label: '30天' },
  { value: 3, label: '360天' },
  { value: 4, label: '永久' }
]
// 订单状态
export const ORDER_STATUS = [
  { value: 0, label: '待支付' },
  { value: 100, label: '派单中' },
  { value: 200, label: '待服务' },
  { value: 300, label: '服务中' },
  // { value: 400, label: '待评价' },
  { value: 500, label: '已完成' },
  { value: 600, label: '已取消' },
  { value: 700, label: '已关闭' }
]
// 交易状态
export const TRADE_STATUS = [
  { value: 2, label: '未支付' },
  { value: 4, label: '已支付' }
]
// 退款状态
export const REFUND_STATUS = [
  { value: 1, label: '退款中' },
  { value: 2, label: '退款成功' },
  { value: 3, label: '退款失败' }
]
// 评分
export const Score = [
  { value: 1, label: '差评（0-1.9分）' },
  { value: 2, label: '中评（2-3.9分）' },
  { value: 3, label: '好评（4-5分）' }
]
// 认证状态
export const AUTH_STATUS = [
  { value: 0, label: '未认证' },
  { value: 1, label: '已认证' }
]
// 审核状态
export const AUDIT_STATUS = [
  { value: 0, label: '待审核' },
  { value: 1, label: '已审核' }
]
// 驳回原因
export const REJECT_REASON = [
  { value: 0, label: '公司信息不完整或不准确' },
  { value: 1, label: '未满足认证要求' },
  { value: 2, label: '风险审核未通过' }
]
// 优惠券类型
export const COUPON_TYPE = [
  { value: 1, label: '满减券' },
  { value: 2, label: '折扣券' }
]
// 发放状态
export const GRANT_STATUS = [
  { value: 2, label: '进行中' },
  { value: 3, label: '已失效' },
  { value: 1, label: '待生效' },
  { value: 4, label: '作废' }
]
