import { formatDateTimeToDateTimeString } from '@/utils/date'
export const COLUMNS = [
  {
    title: '订单编号',
    align: 'left',
    width: 200,
    minWidth: '200px',
    colKey: 'id'
  },
  { title: '服务名称', width: 150, minWidth: '150px', colKey: 'serveItemName' },
  {
    title: '下单时间',
    minWidth: '180px',
    colKey: 'placeOrderTime',
    sortType: 'all',
    cell: (h, { row }) =>
      h('span', row.placeOrderTime ? formatDateTimeToDateTimeString(new Date(row.placeOrderTime)) : '-')
  },
  {
    title: '服务地址',
    colKey: 'serveAddress',
    width: 200,
    minWidth: '288px'
  },
  {
    title: '订单状态',
    colKey: 'ordersStatus',
    width: 120,
    minWidth: '120px',
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '待支付'
        },
        100: {
          label: '派单中'
        },
        200: {
          label: '待服务'
        },
        300: {
          label: '服务中'
        },
        400: {
          label: '待评价'
        },
        500: {
          label: '订单完成'
        },
        600: {
          label: '订单取消'
        },
        700: {
          label: '已关闭'
        }
      }
      let status = 0
      if (row.ordersStatus === 500 || row.ordersStatus === 600) {
        status = 2
      } else {
        status = 0
      }
      return h(
        'span',
        {
          class: `status-dot status-dot-${status}`
        },
        statusList[row.ordersStatus].label
      )
    }
  },
  {
    title: '交易结束时间',
    minWidth: '180px',
    colKey: 'sortTime',
    sortType: 'all',
    cell: (h, { row }) =>
      h('span', row.sortTime ? formatDateTimeToDateTimeString(new Date(row.sortTime)) : '-')
  },
  {
    title: '服务人员姓名',
    width: 150,
    minWidth: '150px',
    colKey: 'serveProviderStaffName'
  },
  {
    title: '服务人员电话',
    minWidth: '170px',
    sortType: 'all',
    colKey: 'serveProviderStaffPhone'
  },
  {
    title: '订单金额（元）',
    width: 150,
    minWidth: '150px',
    colKey: 'totalAmount'
  },
  {
    title: '实付金额（元）',
    width: 150,
    minWidth: '150px',
    colKey: 'realPayAmount'
  },
  {
    title: '支付状态',
    colKey: 'payStatus',
    width: 120,
    minWidth: '120px',
    cell: (h, { row }) => {
      const statusList = {
        2: {
          label: '未支付',
          },
        4: {
          label: '已支付',
          },
      }  
      let status = 1
      if(row.payStatus === 4) {
        status = 2
        }
      return h(
        'span',
        {
          class: `status-dot status-dot-${status}`
        },
        statusList[row.payStatus].label
      )
    }
  },
  {
    title: '退款状态',
    colKey: 'refundStatus',
    width: 120,
    minWidth: '120px',
    cell: (h, { row }) => {
      const statusList = {
        2: {
          label: '退款成功',
          },
        3: {
          label: '退款失败',
          },
        1: {
          label: '退款中',
          },
      }  
      let status = 0
      if(row.refundStatus === 2) {
        status = 2
        }else if(row.refundStatus === 3){
        status = 1
        }else{
        status = 0
        }
        if (row.refundStatus) {
          // const status = row.isActive + 1
          return h(
            'span',
            {
              class: `status-dot status-dot-${status}`
            },
            statusList[row.refundStatus].label
          )
        } else {
          return h(
            'span',
            '-'
          )
        }
    }
  },
  {
    align: 'left',
    fixed: 'right',
    width: 70,
    minWidth: '70px',
    colKey: 'op',
    title: '操作'
  }
]
