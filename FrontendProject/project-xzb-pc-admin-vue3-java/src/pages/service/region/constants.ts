export const COLUMNS = [
  {
    title: '区域编号',
    align: 'left',
    width: 200,
    minWidth: '70px',
    colKey: 'cityCode'
  },
  { title: '区域名称', width: 150, minWidth: '150px', colKey: 'name' },
  { title: '区域负责人', width: 150, minWidth: '150px', colKey: 'managerName' },
  { title: '手机号码', minWidth: '200px', colKey: 'managerPhone' },
  // { title: '服务范围', width: 250, minWidth: '250px', colKey: 'name' },
  {
    title: '状态',
    colKey: 'activeStatus',
    minWidth: '120px',
    width:150,
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
      // const status = row.activeStatus + 1
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
    minWidth: '200px',
    width: 200,
    colKey: 'updateTime',
    sorter: true,
    sortType: 'all'
  },
  {
    align: 'left',
    fixed: 'right',
    width: 370,
    minWidth: '370px',
    colKey: 'op',
    title: '操作'
  }
]
