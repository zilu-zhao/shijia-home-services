import { formatDateTimeToDateTimeString } from '@/utils/date'
// 服务人员信息列表
export const COLUMNS = [
  {
    title: '真实姓名',
    align: 'left',
    width: 150,
    minWidth: '150px',
    colKey: 'name'
  },
  {
    title: '身份证号',
    align: 'left',
    width: 250,
    minWidth: '200px',
    colKey: 'idCardNo'
  },
  {
    title: '身份证人像照片',
    width: 150,
    minWidth: '150px',
    colKey: 'frontImg'
  },
  {
    title: '身份证国徽照片',
    width: 150,
    minWidth: '150px',
    sortType: 'all',
    colKey: 'backImg'
  },
  {
    title: '证明资料',
    width: 150,
    minWidth: '150px',
    colKey: 'certificationMaterial'
  },
  {
    title: '审核状态',
    colKey: 'auditStatus',
    minWidth: '120px',
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '待审核'
        },
        1: {
          label: '已审核'
        }
      }
      const status = row.auditStatus === 1 ? 2 : 0
      return h(
        'span',
        {
          class: `status-dot status-dot-${status}`
        },
        statusList[row.auditStatus].label
      )
    }
  },
  {
    title: '认证状态',
    colKey: 'certificationStatus',
    width: 120,
    minWidth: '120px',
    // 添加筛选
    cell: (h, { row }) => {
      const statusList = {
        1: {
          label: '待认证'
        },
        2: {
          label: '认证成功'
        },
        3: {
          label: '认证失败'
        }
      }
      return h(
        'span',
        {
          class: `status-dot status-dot-${row.certificationStatus}`
        },
        statusList[row.certificationStatus].label
      )
    }
  },
  {
    title: '驳回原因',
    align: 'left',
    width: 250,
    minWidth: '200px',
    colKey: 'rejectReason',
    cell: (h, { row }) => h('span', row.rejectReason ? row.rejectReason : '-')
  },
  {
    title: '申请时间',
    width: 180,
    minWidth: '180px',
    colKey: 'createTime',
    sorter: true,
    sortType: 'all',
    cell: (h, { row }) =>
      h(
        'span',
        row.createTime
          ? formatDateTimeToDateTimeString(new Date(row.createTime))
          : '-'
      )
  },
  {
    title: '审核人',
    align: 'left',
    width: 150,
    minWidth: '150px',
    colKey: 'auditorName	',
    cell: (h, { row }) => h('span', row.auditorName ? row.auditorName : '-')
  },
  {
    title: '审核时间',
    width: 180,
    minWidth: '180px',
    colKey: 'auditTime',
    sorter: true,
    sortType: 'all',
    cell: (h, { row }) =>
      h(
        'span',
        row.auditTime
          ? formatDateTimeToDateTimeString(new Date(row.auditTime))
          : '-'
      )
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
// 申请记录
export const Apply_DATA = [
  {
    title: '序号',
    align: 'left',
    width: 68,
    minWidth: '68px',
    colKey: 'Num'
  },
  {
    title: '认证状态',
    colKey: 'verifyStatus',
    width: 118,
    minWidth: '118px',
    // 添加筛选
    filter: {
      type: 'single',
      list: [
        {
          label: '-',
          value: 0
        },
        {
          label: '认证通过',
          value: 1
        },
        {
          label: '认证失败',
          value: 2
        }
      ],
      showConfirmAndReset: true
    },
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '-'
        },
        1: {
          label: '认证通过'
        },
        2: {
          label: '认证失败'
        },
        3: {
          label: '未认证'
        }
      }
      // const status = row.saleStatus === 2 ? '1' : 0
      return h(
        'span',
        {
          class: `status-dot status-dot-${row.verifyStatus}`
        },
        statusList[row.verifyStatus].label
      )
    }
  },
  {
    title: '驳回原因',
    width: 184,
    minWidth: '184px',
    colKey: 'nam',
    cell: (h, { row }) => h('span', row.nam ? row.nam : '-')
  },
  {
    title: '申请时间',
    minWidth: '155px',
    colKey: 'updateTime',
    sortType: 'all',
    cell: (h, { row }) =>
      h(
        'span',
        row.updateTime
          ? formatDateTimeToDateTimeString(new Date(row.updateTime))
          : '-'
      )
  },
  {
    title: '审核时间',
    minWidth: '155px',
    colKey: 'auditTime',
    sortType: 'all',
    cell: (h, { row }) =>
      h(
        'span',
        row.auditTime
          ? formatDateTimeToDateTimeString(new Date(row.auditTime))
          : '-'
      )
  }
]
