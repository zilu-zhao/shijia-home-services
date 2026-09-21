import {formatDateTimeToDateTimeString } from '@/utils/date'
export const COLUMNS = [
  {
    title: '服务类型编号',
    align: 'left',
    width: 200,
    minWidth: '200px',
    colKey: 'code'
  },
  { title: '服务类型', width: 150, minWidth: '150px', colKey: 'name' },
  {
    title: '服务类型图标',
    colKey: 'serveTypeIcon',
    width: 125,
    minWidth: '125px',
    cell: { col: 'status' }
  },
  {
    title: '服务类型图片',
    colKey: 'img',
    width: 125,
    minWidth: '125px',
    cell: { col: 'status' }
  },
  {
    title: '排序',
    minWidth: '150px',
    width: 150,
    sorter: true,
    sortType: 'all',
    colKey: 'sortNum'
  },
  {
    title: '状态',
    colKey: 'activeStatus',
    width: 200,
    minWidth: '120px',
    // 添加筛选
    filter: {
      type: 'single',
      list: [
        {
          label: '草稿',
          value: 0
        },
        {
          label: '禁用',
          value: 1
        },
        {
          label: '启用',
          value: 2
        },
      ],
      showConfirmAndReset: true
    },
    cell: (h, { row }) => {
      const statusList = {
        0: {
          label: '草稿'
        },
        1: {
          label: '禁用'
        },
        2: {
          label: '启用'
        },
      }  
      // const status = row.isActive + 1
      return h(
        'span',
        {
          class: `status-dot status-dot-${row.activeStatus}`
        },
        statusList[row.activeStatus].label
      )
    }
  },
  {
    title: '更新时间',
    minWidth: '180px',
    colKey: 'updateTime',
    sorter: true,
    sortType: 'all',
    cell:(h, { row }) => h('span',row.updateTime ? formatDateTimeToDateTimeString(new Date(row.updateTime)) : '-')
  },
  {
    align: 'left',
    fixed: 'right',
    width: 247,
    minWidth: '247px',
    colKey: 'op',
    title: '操作'
  }
]
