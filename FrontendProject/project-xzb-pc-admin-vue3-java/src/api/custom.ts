import { request } from '@/utils/request'
import type { customListRequest, customFreezeRequest } from '@/api/model/customModel'

// 普通用户分页查询
export function getCustomList(data: customListRequest) {
  return request.get({
    url: '/customer/operation/common-user/page',
    params: data
  })
}
// 冻结/解冻
export function customFreeze(data: customFreezeRequest) {
  return request.put({
    url: '/customer/operation/common-user/updateStatus',
    data: data
  })
}