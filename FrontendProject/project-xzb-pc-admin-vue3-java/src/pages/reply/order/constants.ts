import {formatDateTimeToDateTimeString } from '@/utils/date'
export const COLUMNS = [
  {
    title: '评价内容',
    align: 'left',
    width: 250,
    minWidth: '250px',
    colKey: 'id'
  },
  {
    title: '评价评分',
    colKey: 'content',
    width: 300,
    minWidth: '300px',
    cell: { col: 'status' }
  },
  {
    title: '服务名称',
    minWidth: '120px',
    width: 120,
    colKey: 'score_array'
  },
  {
    title: '评价人',
    colKey: 'targetName',
    width: 200,
    minWidth: '150px',
    cell: { col: 'status' }
  },
  {
    title: '评价图片',
    width: 150,
    minWidth: '150px',
    colKey: 'picture',
  },
  {
    title: '评价时间',
    width: 280,
    minWidth: '180px',
    colKey: 'createTime',
    cell:(h, { row }) => h('span',row.createTime ? formatDateTimeToDateTimeString(new Date(row.createTime)) : '-')
  },
  {
    align: 'left',
    fixed: 'right',
    width: 160,
    minWidth: '160px',
    colKey: 'op',
    title: '操作'
  }
]
