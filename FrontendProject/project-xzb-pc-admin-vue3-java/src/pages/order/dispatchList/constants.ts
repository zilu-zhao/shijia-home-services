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
    colKey: 'createTime',
    sortType: 'all',
    cell: (h, { row }) => h('span',row.createTime ? formatDateTimeToDateTimeString(new Date(row.createTime)) : '-')
  },  
  {
    title: '服务地址',
    colKey: 'serveAddress',
    width: 200,
    minWidth: '288px',
  },
  {
    title: '预约时间',
    minWidth: '180px',
    colKey: 'updateTime',
    sortType: 'all',
  },  
  {
    title: '指派超时',
    colKey: 'ordersStatus',
    width: 120,
    minWidth: '120px',
    // 添加筛选
    filter: {
      type: 'single',
      list: [
        {
          label: '是',
          value: 0
        },
        {
          label: '否',
          value: 1
        },
      ],
      showConfirmAndReset: true
    },
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '是',
          },
        1: {
          label: '否',
          },
      }  
      let status = 0
      if(row.ordersStatus === 100 || row.ordersStatus === 200 || row.ordersStatus === 300 || row.ordersStatus === 400 || row.ordersStatus === 500) {
        status = 0
        }else if(row.ordersStatus === 700){
        status = 2
        }else{
          status = 1
        }
      return h(
        'span',
        {
          class: `status-dot status-dot-${status}`
        },
        statusList[1].label
      )
    }
  },
  {
    align: 'left',
    fixed: 'right',
    width: 157,
    minWidth: '157px',
    colKey: 'op',
    title: '操作'
  }
]
export const PERSON_COLUMNS = [
  {
    // title: '单选',
    // align: 'center',
    colKey: 'row-select',
    type: 'single',
    // 允许单选(Radio)取消行选中
    checkProps: { allowUncheck: true },

    // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删，随时需要测试）。disabled 参数：{row: RowData; rowIndex: number })
    // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
    // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

    // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删，随时需要测试）
    // 这种方式禁用行选中，行文本不会变灰，不会添加类名 t-table__row--disabled
    // checkProps: ({ rowIndex }) => ({ disabled: rowIndex % 2 !== 0 }),
    width: 40,
  },
  {
    title: '个人/企业编号',
    align: 'left',
    width: 147,
    minWidth: '147px',
    colKey: 'id'
  },
  { title: '服务人员姓名（个体）', width: 160, minWidth: '160px', colKey: 'serveItemName' },
  {
    title: '企业名称',
    minWidth: '188px',
    colKey: 'createTime',
    sortType: 'all',
    cell: (h, { row }) => h('span',formatDateTimeToDateTimeString(new Date(row.createTime)))
  },  
  {
    title: '电话号码',
    colKey: 'contactsPhone',
    width: 119,
    minWidth: '119px',
  },
  {
    title: '已接单量',
    colKey: 'ordersStatus',
    width: 76,
    minWidth: '76px',
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '待支付',
          },
        100: {
          label: '派单中',
          },
        200: {
          label: '待服务',
          },
        300: {
          label: '服务中',
          },
        400: {
          label: '待评价',
          },
        500: {
          label: '订单完成',
          },
        600: {
          label: '订单取消',
          },
        700: {
          label: '已关闭',
          },
      }  
      let status = 0
      if(row.ordersStatus === 500 || row.ordersStatus === 600) {
        status = 2
        }else{
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
    title: '接单状态',
    colKey: 'ordersStatus',
    width: 76,
    minWidth: '76px',
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '接单中',
          },
        1: {
          label: '休息中',
          },
      }  
      let status = 0
      if(row.ordersStatus === 100 || row.ordersStatus === 200 || row.ordersStatus === 300 || row.ordersStatus === 400 || row.ordersStatus === 500) {
        status = 0
        }else if(row.ordersStatus === 700){
        status = 2
        }else{
          status = 1
        }
      return h(
        'span',
        {
          class: `status-dot status-dot-${status}`
        },
        statusList[0].label
      )
    }
  },
  {
    title: '距离（公里）',
    minWidth: '104px',
    width: 104,
    colKey: 'ordersStatus',
    sortType: 'all',
  },  
  {
    width: 48,
    minWidth: '48px',
    colKey: 'op2',
    title: '操作'
  }
]
