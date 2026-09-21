import { request } from '@/utils/request'

// 根据订单id查询
export function getOrderById(id) {
  return request.get({
    url: '/orders-manager/operation/orders/aggregation/' + id
  })
}
// 订单分页查询
export function getOrderList(value :any) {
  return request.get({
    url: '/orders-manager/operation/orders/page',
    params: value
  })
}
// 订单退款
export function refundOrder(value :any) {
  return request.put({
    url: '/orders-manager/operation/orders/cancel',
    data: value
  })
}
// 历史订单分页查询
export function getHistoryOrderList(value :any) {
  return request.get({
    url: '/orders-history/operation/orders/page',
    params: value
  })
}
// 查询历史订单详情
export function getHistoryOrderById(id) {
  return request.get({
    url: '/orders-history/operation/orders/' + id
  })
}