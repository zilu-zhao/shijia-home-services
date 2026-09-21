import { request } from '@/utils/request'
import type { ListResult } from '@/api/model/listModel'

export function getProjectList() {
  return request.get<ListResult>({
    url: '/get-detail-list'
  })
}
// 首页数据
export function getDashBoardData(params) {
  return request.get({
    url: '/orders-history/operation/orders-statistics/homePage',
    params
  })
}
// 导出统计数据
export function exportStatisticsData(params) {
  return request.get({
    url: '/orders-history/operation/orders-statistics/downloadStatistics',
    params,
    responseType: 'blob'
  })
}
