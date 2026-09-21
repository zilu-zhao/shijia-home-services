import {formatDateTimeToDateTimeString } from '@/utils/date'
// 服务人员信息列表
export const COLUMNS = [
  {
    title: '企业名称',
    align: 'left',
    width: 250,
    minWidth: '200px',
    colKey: 'name'
  },
  {
    title: '登录账号',
    align: 'left',
    width: 250,
    minWidth: '200px',
    colKey: 'phone'
  },
  {
    title: '统一社会信用代码',
    align: 'left',
    width: 250,
    minWidth: '200px',
    colKey: 'idNumber'
  },
  // { title: '服务分类',width:250, minWidth: '150px', colKey: 'name' },
  {
    title: '服务城市',
    width:250,
    minWidth: '170px',
    sortType: 'all',
    colKey: 'cityName'
  },
  {
    title: '接单状态',
    colKey: 'canPickUp',
    minWidth: '120px',
    // 添加筛选
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '休息中'
        },
        1: {
          label: '接单中'
        },
        '-1': {
          label: '未设置'
        },
      }  
      // const status = row.canPickUp === -1 ? 2 : row.canPickUp
      return h(
        'span',
        {
          class: `status-dot status-dot-${row.canPickUp + 1}`
        },
        statusList[row.canPickUp].label
      )
    }
  },
  {
    title: '账号状态',
    colKey: 'status',
    minWidth: '120px',
    // 添加筛选
    filter: {
      type: 'single',
      list: [
        {
          label: '正常',
          value: 0
        },
        {
          label: '冻结',
          value: 1
        },
      ],
      showConfirmAndReset: true
    },
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '正常'
        },
        1: {
          label: '冻结'
        },
      }  
      const status = row.status === 0 ? '2' : 1
      return h(
        'span',
        {
          class: `status-dot status-dot-${status}`
        },
        statusList[row.status].label
      )
    }
  },
  {
    title: '认证时间',
    width: 250,
    minWidth: '180px',
    colKey: 'certificationTime',
    cell: (h, { row }) => h('span',row.certificationTime ? formatDateTimeToDateTimeString(new Date(row.certificationTime)) : '-')
  },  
  {
    align: 'left',
    fixed: 'right',
    width: 120,
    minWidth: '120px',
    colKey: 'op',
    title: '操作'
  }
]
// 服务数据
export const SERVE_DATA =  [
  {
    title: '订单编号',
    align: 'left',
    width: 200,
    minWidth: '200px',
    colKey: 'id'
  },
  { title: '服务名称', width: 150, minWidth: '150px', colKey: 'serveItemName' },
  { title: '评价评分（分）', width: 150, minWidth: '150px', colKey: 'score' },
  {
    title: '实付金额（元）',
    minWidth: '288px',
    sortType: 'all',
    colKey: 'ordersAmount'
  },
  { title: '服务人员', width: 150, minWidth: '150px', colKey: 'institutionStaffName' },
  {
    title: '服务完成时间',
    minWidth: '180px',
    colKey: 'realServeEndTime',
    sortType: 'all',
    cell: (h, { row }) => {
      if(row.realServeEndTime){
        return h('span',formatDateTimeToDateTimeString(new Date(row.realServeEndTime)))
      }else{
        return h('span','--')
      }
    }
  }, 
  {
    title: '服务前照片',
    minWidth: '180px',
    colKey: 'serveBeforeImgs',
    sortType: 'all'
  }, 
  {
    title: '服务后照片',
    minWidth: '180px',
    colKey: 'serveAfterImgs',
    sortType: 'all'
  }, 
  {
    align: 'left',
    // fixed: 'right',
    width: 100,
    minWidth: '100px',
    colKey: 'op2',
    title: '操作'
  }
]
// 服务人员信息
export const SERVE_COLUMNS =  [
  { title: '服务人员姓名', width: 150, minWidth: '150px', colKey: 'name' },
  {
    title: '服务人员手机',
    minWidth: '170px',
    sortType: 'all',
    colKey: 'phone'
  },
  {
    title: '身份证号',
    minWidth: '185px',
    colKey: 'idCardNo',
  }, 
  {
    title: '证明资料',
    minWidth: '180px',
    colKey: 'certificationImgs',
  }, 
  {
    title: '创建时间',
    minWidth: '180px',
    colKey: 'createTime',
    sortType: 'all',
    cell: (h, { row }) => {
      if(row.createTime){
        return h('span',formatDateTimeToDateTimeString(new Date(row.createTime)))
      }else{
        return h('span','--')
      }
    }
  },
]
  




