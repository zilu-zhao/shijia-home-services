import dayjs from 'dayjs'
export const COLUMNS = [
  {
    title: '活动编号',
    align: 'left',
    width: 200,
    minWidth: '200px',
    colKey: 'id'
  },
  { title: '活动名称', width: 180, minWidth: '180px', colKey: 'name' },
  {
    title: '优惠券类型',
    minWidth: '180px',
    colKey: 'type',
    sortType: 'all',
    cell: (h, { row }) => {
      const statusList = {
        1: {
          label: '满减'
        },
        2: {
          label: '折扣'
        }
      }
      return h('span', statusList[row.type].label)
    }
  },
  {
    title: '满额限制（元）',
    colKey: 'amountCondition',
    width: 150,
    minWidth: '150px',
    cell: (h, { row }) =>
      h('span', row.amountCondition === 0 ? '无门槛' : row.amountCondition)
  },
  {
    title: '折扣金额（元）/比例',
    colKey: 'discountRate',
    width: 200,
    minWidth: '288px',
    cell: (h, { row }) =>
      h(
        'span',
        row.type === 1 ? row.discountAmount + '元' : row.discountRate + '%'
      )
  },
  {
    title: '使用范围',
    colKey: 'serveAddress',
    width: 130,
    minWidth: '130px',
    cell: (h, { row }) => h('span', '全场通用')
  },
  {
    title: '适用对象',
    colKey: 'serveAddress',
    width: 130,
    minWidth: '130px',
    cell: (h) => h('span', '全部用户')
  },
  {
    title: '发放时间',
    minWidth: '320px',
    colKey: 'distributeStartTime',
    sortType: 'all',
    cell: (h, { row }) =>
      h(
        'span',
        dayjs(row.distributeStartTime).format(' YYYY-MM-DD HH:mm') +
          ' ~ ' +
          dayjs(row.distributeEndTime).format(' YYYY-MM-DD HH:mm')
      )
  },
  {
    title: '使用期限（天）',
    colKey: 'validityDays',
    width: 150,
    minWidth: '150px'
  },
  {
    title: '发放数量（张）',
    colKey: 'totalNum',
    width: 150,
    minWidth: '150px',
    cell: (h, { row }) =>
      h('span', row.totalNum === 0 ? '无限制' : row.totalNum)
  },
  {
    title: '每人限领（张）',
    colKey: 'serveAddress',
    width: 150,
    minWidth: '150px',
    cell: (h) => h('span', 1)
  },
  {
    title: '发放状态',
    colKey: 'status',
    width: 120,
    minWidth: '120px',
    // 添加筛选
    cell: (h, { row }) => {
      const statusList = {
        2: {
          label: '进行中'
        },
        3: {
          label: '已失效'
        },
        1: {
          label: '待生效'
        },
        4: {
          label: '作废'
        }
      }
      return h(
        'span',
        {
          class: `status-dot status-dot-${
            row.status === 3 || row.status === 4 ? 1 : row.status === 1 ? 0 : 2
          }`
        },
        statusList[row.status].label
      )
    }
  },
  {
    title: '创建时间',
    minWidth: '180px',
    colKey: 'createTime',
    sortType: 'all',
    cell: (h, { row }) =>
      h(
        'span',
        row.createTime
          ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm')
          : '-'
      )
  },
  {
    align: 'left',
    fixed: 'right',
    width: 190,
    minWidth: '190px',
    colKey: 'op',
    title: '操作'
  }
]
export const PERSON_COLUMNS = [
  {
    title: '用户手机号',
    align: 'left',
    width: 147,
    minWidth: '147px',
    colKey: 'userPhone',
    cell: (h, { row }) => h('span', row.userPhone || '-')
  },
  {
    title: '领取时间',
    minWidth: '180px',
    colKey: 'createTime',
    sortType: 'all',
    cell: (h, { row }) =>
      h(
        'span',
        row.createTime
          ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm')
          : '-'
      )
  },
  {
    title: '使用时间',
    minWidth: '184px',
    width: 184,
    colKey: 'useTime',
    sortType: 'all',
    cell: (h, { row }) =>
      h(
        'span',
        row.useTime
          ? dayjs(row.useTime).format('YYYY-MM-DD HH:mm')
          : '-'
      )
  },
  {
    title: '优惠券状态',
    colKey: 'status',
    minWidth: '104px',
    cell: (h, { row }) => {
      const statusList = {
        1: {
          label: '待使用'
        },
        2: {
          label: '已使用'
        },
        3: {
          label: '已过期'
        },
        4: {
          label: '作废'
        }
      }
      return h(
        'span',
        {
          class: `status-dot status-dot-${
            row.status === 3 || row.status === 4 ? 1 : row.status === 1 ? 0 : 2
          }`
        },
        statusList[row.status].label
      )
    }
  },
  {
    title: '使用订单',
    minWidth: '180px',
    width: 180,
    colKey: 'ordersId',
    sortType: 'all',
    cell: (h, { row }) => h('span', row.ordersId || '-')
  }
]
