import { request } from '@/utils/request'
// 运营端分页查询活动优惠券
export function getCouponList(data) {
  return request.get({
    url: '/market/operation/activity/page',
    params: data
  })
}
// 根据活动id查询活动优惠券领取记录
export function getCouponRecordList(data) {
  return request.get({
    url: '/market/operation/coupon/page',
    params: data
  })
}
// 活动保存
export function saveCoupon(data) {
  return request.post({
    url: '/market/operation/activity/save',
    data
  })
}
// 查询活动详情
export function getCouponDetail(id) {
  return request.get({
    url: '/market/operation/activity/' + id,
  })
}
// 活动撤销，即删除优惠券
export function deleteCoupon(id) {
  return request.post({
    url: '/market/operation/activity/revoke/' + id,
  })
}