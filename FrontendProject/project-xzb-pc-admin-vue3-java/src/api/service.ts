import { request } from '@/utils/request'
import type {
  serviceTypeResult,
  serviceTypeStatus,
  serviceTypeAdd,
  serviceTypeItemList,
  serviceItemTypeAdd,
  regionTypeAdd,
  regionTypeEdit,
  serviceListType
} from '@/api/model/serviceModel'

// 获取服务类型列表数据
export function getServiceTypeList(value :serviceTypeResult) {
  return request.get({
    url: '/foundations/operation/serve-type/page',
    params: value
  })
}
// 服务类型启用
export function serviceTypeActiveStatus(id) {
  return request.put({
    url: `/foundations/operation/serve-type/activate/${id}`,

  })
}
// 服务类型禁用
export function serviceTypeInactiveStatus(id) {
  return request.put({
    url: `/foundations/operation/serve-type/deactivate/${id}`,
  })
}
// 服务类型新增
export function serviceTypeAdd(value :serviceTypeAdd) {
  return request.post({
    url: '/foundations/operation/serve-type',
    data: value
  })
}
// 服务类型编辑
export function serviceTypeEdit(value :serviceTypeAdd, id :string) {
  return request.put({
    url: '/foundations/operation/serve-type/' + id,
    data: value
  })
}
// 服务类型删除
export function serviceTypeDelete(id :string) {
  return request.delete({
    url: '/foundations/operation/serve-type/' + id
  })
}
// 服务类型简略列表，用于下拉框
export function serviceTypeSimpleList(val?) {
  return request.get({
    url: '/foundations/operation/serve-type/queryServeTypeListByActiveStatus',
    params: val
  })
}
// 分页查询服务项
export function serviceItemList(value :serviceTypeItemList) {
  return request.get({
    url: '/foundations/operation/serve-item/page',
    params: value
  })
}
// 服务项启用
export function serviceItemActivateStatus(id) {
  return request.put({
    url: `/foundations/operation/serve-item/activate/${id}`,
  })
}
// 服务项禁用
export function serviceItemDeactivateStatus(id) {
  return request.put({
    url: `/foundations/operation/serve-item/deactivate/${id}`,
  })
}
// 服务项新增
export function serviceItemAdd(value :serviceItemTypeAdd) {
  return request.post({
    url: '/foundations/operation/serve-item',
    data: value
  })
}
// 服务项删除
export function serviceItemDelete(id :string) {
  return request.delete({
    url: '/foundations/operation/serve-item/' + id
  })
}

// 根据id查询服务项
export function serviceItemById(id :string) {
  return request.get({
    url: '/foundations/operation/serve-item/' + id
  })
}
// 服务项编辑
export function serviceItemEdit(value :serviceItemTypeAdd, id) {
  return request.put({
    url: '/foundations/operation/serve-item/' + id,
    data: value
  })
}
// 区域分页查询
export function regionList(value :serviceTypeResult) {
  return request.get({
    url: '/foundations/operation/region/page',
    params: value
  })
}
// 区域新增
export function regionAdd(value :regionTypeAdd) {
  return request.post({
    url: '/foundations/operation/region',
    data: value
  })
}
// 区域编辑
export function regionEdit(value :regionTypeEdit, id :string) {
  return request.put({
    url: '/foundations/operation/region/' + id + '?' + 'managerName=' + value.managerName + '&' + 'managerPhone=' + value.managerPhone,
    data: value
  })
}
// 区域删除
export function regionDelete(id :string) {
  return request.delete({
    url: '/foundations/operation/region/' + id
  })
}
// 根据id查询区域
export function regionById(id) {
  return request.get({
    url: '/foundations/operation/region/' + id
  })
}
// 服务分页查询
export function serviceList(value :serviceListType) {
  return request.get({
    url: '/foundations/operation/serve/page',
    params: value
  })
}
// 服务批量新增
export function serviceAdd(value) {
  return request.post({
    url: '/foundations/operation/serve/batch',
    data: value
  })
}
// 服务编辑（只有价格）
export function serviceEdit(value) {
  return request.put({
    url: '/foundations/operation/serve/' + value.id + '?' + 'price=' + value.price,
  })
}
// 区域服务设置热门
export function serviceOnHot(id) {
  return request.put({
    url: '/foundations/operation/serve/onHot/' + id,
  })
}
// 区域服务取消热门
export function serviceOffHot(id) {
  return request.put({
    url: '/foundations/operation/serve/offHot/' + id,
  })
}
// 服务启用
export function serviceActiveStatus(id) {
  return request.put({
    url: `/foundations/operation/serve/onSale/${id}`,
  })
}
// 服务禁用
export function serviceInactiveStatus(id) {
  return request.put({
    url: `/foundations/operation/serve/offSale/${id}`,
  })
}
// 服务删除
export function serviceDelete(id) {
  return request.delete({
    url: '/foundations/operation/serve/' + id
  })
}
// 接口名称：机构分页查询
export function serviceInstitutionList(value) {
  return request.get({
    url: '/customer/operation/serve-provider/pageQueryAgency',
    params: value
  })
}
// 服务人员分页查询
export function servicePersonList(value) {
  return request.get({
    url: '/customer/operation/serve-provider/pageQueryWorker',
    params: value
  })
}
// 服务人员、机构详情
export function servicePersonDetail(id) {
  return request.get({
    url: '/customer/operation/serve-provider/basicInformation/' + id
  })
}
// 服务人员、机构冻结/解冻
export function servicePersonStatus(value) {
  return request.put({
    url: '/customer/operation/serve-provider/updateStatus',
    data: value
  })
}
// 机构下属服务人员相关接口分页查询
export function servicePersonItemList(value) {
  return request.get({
    url: '/customer/operation/institution-staff/page',
    params: value
  })
}
// 根据id查询调度配置
export function servicePersonItemById(id) {
  return request.get({
    url: '/foundations/operation/config-region/' + id
  })
}
// 更新调度配置
export function servicePersonItemEdit(value) {
  return request.put({
    url: `/foundations/operation/config-region/${value.id}`,
    data: value
  })
}
// 区域启用
export function regionActiveStatus(id) {
  return request.put({
    url: `/foundations/operation/region/activate/${id}`,
  })
}
// 区域禁用
export function regionInactiveStatus(id) {
  return request.put({
    url: `/foundations/operation/region/deactivate/${id}`,
  })
}
// 已开通服务区域列表
export function regionOpenList() {
  return request.get({
    url: '/foundations/operation/region/activeRegionList',
  })
}
// 刷新区域相关缓存
export function regionRefreshCache(id) {
  return request.put({
    url: `/foundations/operation/region/refreshRegionRelateCaches/${id}`,
  })
}
// 机构认真审核信息分页查询
export function serviceInstitutionAuditList(value) {
  return request.get({
    url: '/customer/operation/agency-certification-audit/page',
    params: value
  })
}
// 服务人员认证审核信息分页查询
export function servicePersonAuditList(value) {
  return request.get({
    url: '/customer/operation/worker-certification-audit/page',
    params: value
  })
}
// 审核机构认证信息
export function serviceInstitutionAudit(value, id) {
  return request.put({
    url: '/customer/operation/agency-certification-audit/audit/' + id + '?' + 'rejectReason='+ value.rejectReason + '&' + 'certificationStatus=' + value.certificationStatus,
    data: value
  })
}
// 审核服务人员认证信息
export function servicePersonAudit(value, id) {
  return request.put({
    url: '/customer/operation/worker-certification-audit/audit/' + id + '?' + 'rejectReason='+ value.rejectReason + '&' + 'certificationStatus=' + value.certificationStatus,
    data: value
  })
}
// 根据机构id查询认证信息
export function serviceInstitutionAuditDetail(id) {
  return request.get({
    url: '/customer/operation/agency-certification/' + id
  })
}
// 根据服务人员id查询认证信息
export function servicePersonAuditDetail(id) {
  return request.get({
    url: '/customer/operation/worker-certification/' + id
  })
}
// 根据服务人员/机构id查询银行账户信息
export function servicePersonBankDetail(id) {
  return request.get({
    url: '/customer/operation/bank-account/' + id
  })
}
// 获取评价系统token
export function serviceToken() {
  return request.get({
    url: '/customer/operation/evaluation/token'
  })
}
// 查询服务人员/机构服务数据
export function servicePersonData(value) {
  return request.get({
    url: '/orders-manager/operation/ordersServe/pageQueryByServeProvider',
    params: value
  })
}