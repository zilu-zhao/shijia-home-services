import { request } from '@/utils/request'
import type {
  CardListResult,
  ListResult,
  addListParams,
  deleteListParams,
  ListCollapseResult,
  ListTransferModel,
  ListCardsortResult
} from '@/api/model/listModel'

export function getList() {
  return request.get<ListResult>({
    url: '/get-list'
  })
}

export function getCardList() {
  return request.get<CardListResult>({
    url: '/get-card-list'
  })
}
// 新增和编辑基础列表的数据
export function addList(params: addListParams) {
  return request.post<addListParams>({
    url: '/list-basic/add',
    data: params
  })
}
// 删除基础列表的数据
export function deleteList(params: deleteListParams) {
  return request.post<deleteListParams>({
    url: '/list-basic/delete',
    data: params
  })
}
// 折叠列表数据
export function getCollapseList() {
  return request.get<ListCollapseResult>({
    url: '/get-collapse-list'
  })
}

// 穿梭框数据
export function getTransferList() {
  return request.get<ListTransferModel>({
    url: '/get-transfer-list'
  })
}
// 卡片数据
export function getcardSortList() {
  return request.get<ListCardsortResult>({
    url: '/get-cardsort-list'
  })
}
// 列表弹层例表数据
export function getDialogList() {
  return request.get<ListCardsortResult>({
    url: '/get-dialog-list'
  })
}
// 树形列表数据
export function getTreeList() {
  return request.get<ListCardsortResult>({
    url: '/get-tree-list'
  })
}
// 下拉列表数据
export function getSelectList() {
  return request.get<ListCardsortResult>({
    url: '/get-select'
  })
}
// 带tab的列表
export function getTabList() {
  return request.get<ListCardsortResult>({
    url: '/get-tab-list'
  })
}
