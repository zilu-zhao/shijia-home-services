import dayjs from 'dayjs'
// import { TChartColor } from '@/config/color'
import { getChartListColor } from '@/utils/color'
import { getRandomArray } from '@/utils/charts'
import { floor } from 'lodash'

/** 柱状图数据源 */
export function constructInitDataset({
  dateTime = [],
  placeholderColor,
  borderColor
}: { dateTime: Array<string> } & any) {
  const divideNum = 10
  const timeArray = []
  const outArray = []
  for (let i = 0; i < divideNum; i++) {
    if (dateTime.length > 0) {
      const dateAbsTime: number =
        (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) /
        divideNum
      const enhandTime: number =
        new Date(dateTime[0]).getTime() + dateAbsTime * i
      timeArray.push(dayjs(enhandTime).format('YYYY-MM-DD'))
    } else {
      timeArray.push(
        dayjs()
          .subtract(divideNum - i, 'day')
          .format('YYYY-MM-DD')
      )
    }
    outArray.push(getRandomArray().toString())
  }
  const courses = [
    'Java-基础课',
    'Java-进阶课',
    'Java-高手班',
    'Python-基础课',
    'Python-进阶课',
    'Python-高手班',
    '大数据-基础课',
    '大数据-进阶课',
    '大数据-高手班',
    '数据结构'
  ]

  const dataset = {
    color: getChartListColor(),
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: courses,
      axisLabel: {
        color: '#999999',
        show: true
      },
      axisLine: {
        lineStyle: {
          width: 1,
          color: '#ccc'
        }
      }
    },
    yAxis: {
      type: 'value', // 值轴
      axisLabel: {
        color: '#999999'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e5e5e5'
        }
      }
    },
    grid: {
      top: '15px',
      left: '0',
      right: 0,
      bottom: '0',
      containLabel: true
      // 单位
    },
    legend: {
      show: false,
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 4,
      itemGap: 48,
      textStyle: {
        fontSize: 12
      },
      left: 'center',
      bottom: '0',
      orient: 'horizontal',
      data: ['综合评分']
    },
    series: [
      {
        name: '综合评分',
        data: outArray,
        type: 'bar',
        color: '#0061fd',
        barWidth: '40%',
        barMaxWidth: '50px'
      }
    ]
  }

  return dataset
}

/**
 *  线性图表数据源
 *
 * @export
 * @param {Array<string>} [dateTime=[]]
 * @returns {*}
 */
export function getLineChartDataSet({
  count = [],
  countDate = [],
  placeholderColor
}: { count?: Array<string>; countDate?: Array<string> } & any) {
  let intervalNum = 0
  intervalNum = Math.ceil(countDate.length / 15)
  // if (countDate.length <= 15) {
  //   intervalNum = 0
  // } else if (countDate.length <= 30 && countDate.length > 15) {
  //   intervalNum = 1
  // } else if (countDate.length > 30 && countDate.length <= 90) {
  //   intervalNum = 5
  // }
  const dataSet = {
    color: getChartListColor(),
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        // params 是当前 tooltip 的内容
        // 你可以从 params 中提取数据并自定义 tooltip 显示的内容
        var content =
          '<div style="padding:0px 5px;width:123px;height:30px;font-size:12px;color:#999">' +
          '<div style="display:flex;justify-content:space-between;height:14px;line-height:14px;margin-bottom:2px">' +
          '<span>' +
          '日期：' +
          '</span>' +
          '<span style="color:#20232A">' +
          params[0].name +
          '</span>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;height:14px;line-height:14px">' +
          '<span>' +
          '订单总量：' +
          '</span>' +
          '<span style="color:#20232A">' +
          params[0].value +
          '笔' +
          '</span>' +
          '</div>' +
          '</div>'
        return content
      }
    },
    grid: {
      left: '0',
      right: '20px',
      top: '15px',
      bottom: '0',
      containLabel: true
    },
    legend: {
      show: false,
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 4,
      itemGap: 48,
      left: 'center',
      bottom: '0',
      orient: 'horizontal',
      textStyle: {
        fontSize: 12
      }
    },
    xAxis: {
      data: countDate,
      boundaryGap: false, // 坐标轴两边留白
      axisLabel: {
        color: '#999999',
        interval: intervalNum
      },
      axisLine: {
        lineStyle: {
          width: 1,
          color: '#ccc'
        }
      },
      splitLine: {
        show: false // 禁用 x 轴的分割线
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#999999'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#e5e5e5'
        }
      },
      axisLine: {
        lineStyle: {
          width: 1
        }
      }
    },
    series: [
      {
        name: '订单数',
        data: count,
        type: 'line',
        color: '#F74346',
        symbol: 'circle',
        symbolSize: 8, // 设置拐点的大小
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0, // 渐变色起始点 x 坐标
              y: 0, // 渐变色起始点 y 坐标
              x2: 0, // 渐变色结束点 x 坐标
              y2: 1, // 渐变色结束点 y 坐标
              colorStops: [
                { offset: 0, color: 'rgba(247, 67, 70, 0.6)' }, // 渐变色起始颜色和透明度
                { offset: 1, color: 'rgba(247, 119, 112, 0.0)' } // 渐变色结束颜色和透明度
              ]
            }
          }
        },
        emphasis: {
          // hover 状态下的配置
          symbol: 'emptyCircle', // 设置拐点为空心圆球
          symbolSize: 9, // 设置空心圆球的大小
          itemStyle: {
            borderWidth: 2, // 设置空心圆球的边框宽度，非零值表示空心
            borderColor: '#F74346', // 设置空心圆球的边框颜色
            color: '#FFF' // 设置空心圆球的填充颜色
          }
        }
      }
    ]
  }
  return dataSet
}
// 双折线图
export function getDoubleLineChartDataSet({
  count = [],
  count2 = [],
  countDate = [],
  placeholderColor
}: {
  count?: Array<string>
  count2?: Array<string>
  countDate?: Array<string>
} & any) {
  let intervalNum = 0
  if (countDate.length <= 15) {
    intervalNum = 0
  } else if (countDate.length <= 30 && countDate.length > 15) {
    intervalNum = 1
  } else if (countDate.length > 30 && countDate.length <= 90) {
    intervalNum = 5
  }
  count = [1220, 1332, 1031, 1344, 905, 230, 210, 1201, 1323, 1301, 344, 590]
  count2 = [820, 932, 901, 934, 1290, 1330, 1320, 1230, 1230, 1290, 1330, 1320]
  countDate = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月'
  ]
  const dataSet = {
    color: getChartListColor(),
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        var data1 =
          '<div style="display:flex;justify-content:space-between;height:14px;line-height:14px;">' +
          '<span style="margin-right:15px">' +
          params[0].seriesName +
          params[0].axisValue +
          '平均支付笔数：' +
          '</span>' +
          '<span style="color:#20232A">' +
          params[0].value +
          '笔' +
          '</span>' +
          '</div>'
        var data2 = ''
        if (params.length == 2) {
          data2 =
            '<div style="display:flex;justify-content:space-between;height:14px;line-height:14px;margin-top:2px;">' +
            '<span style="margin-right:15px">' +
            params[1].seriesName +
            params[1].axisValue +
            '平均支付笔数：' +
            '</span>' +
            '<span style="color:#20232A">' +
            params[1].value +
          '笔' + '</span>' + '</div>'
        } else {
          data2 = ''
        }

        // params 是当前 tooltip 的内容
        // 你可以从 params 中提取数据并自定义 tooltip 显示的内容
        var content =
          '<div style="padding:0px 5px;max-height:30px;font-size:12px;color:#999">' +
          data1 + data2 +
        '</div>'
        return content
      }
    },
    grid: {
      left: '0',
      right: '20px',
      top: '15px',
      bottom: '40px',
      containLabel: true
    },
    legend: {
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 4,
      itemGap: 48,
      left: 'center',
      bottom: '0',
      orient: 'horizontal',
      textStyle: {
        fontSize: 12
      }
    },
    xAxis: {
      data: countDate,
      boundaryGap: false, // 坐标轴两边留白
      axisLabel: {
        color: '#999999',
        interval: intervalNum
      },
      axisLine: {
        lineStyle: {
          width: 1,
          color: '#ccc'
        }
      },
      splitLine: {
        show: false // 禁用 x 轴的分割线
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#999999'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#e5e5e5'
        }
      },
      axisLine: {
        lineStyle: {
          width: 1
        }
      }
    },
    series: [
      {
        name: '2022年',
        data: count,
        type: 'line',
        color: '#F74346',
        symbol: 'circle',
        symbolSize: 6 // 设置拐点的大小
      },
      {
        name: '2023年',
        data: count2,
        type: 'line',
        color: '#0398FF',
        symbol: 'circle',
        symbolSize: 6 // 设置拐点的大小
      }
    ]
  }
  return dataSet
}
// 漏斗图数据
export function getFunnelDataSet({
  count = [],
  count2 = [],
  countDate = [],
  placeholderColor
}: {
  count?: Array<string>
  count2?: Array<string>
  countDate?: Array<string>
} & any) {
  const dataSet = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}'
    },
    series: [
      {
        name: '漏斗图',
        type: 'funnel',
        left: '10%',
        top: 20,
        bottom: 10,
        width: '80%', // 漏斗图的宽度
        minSize: '30%', // 设置最小值
        maxSize: '90%', // 设置最大值
        sort: 'descending',
        funnelAlign: 'center', // 将漏斗底部形状设置为平坦
        label: {
          show: true, // 显示标签
          position: 'inside', // 标签位置，可以设置为 'inside'、'top'、'bottom' 等
          fontSize: 12, // 标签字体大小
          color: '#fff', // 标签文字颜色
          formatter: function (params) {
            // 自定义标签内容为 name + value
            return params.name + ' ' + params.value
          }
        },
        data: [
          {
            value: count[0].value,
            name: count[0].name,
            itemStyle: { color: '#F74346' }
          },
          {
            value: count[1].value,
            name: count[1].name,
            itemStyle: { color: '#FFAB2D' }
          },
          {
            value: count[2].value,
            name: count[2].name,
            itemStyle: { color: '#0398FF' }
          }
        ],
        z: 100
      },
      {
        name: 'Actual',
        type: 'funnel',
        left: '10%',
        top: 20,
        width: '80%',
        minSize: '30%',
        maxSize: '90%',
        bottom: 10,
        label: {
          position: 'right', // 标签位置
          fontSize: 12, // 标签字体大小
          color: 'black', // 标签文字颜色
          formatter: function (params) {
            // 自定义标签内容为 name + value
            const ratio =
              ((params.value / count[0].value) * 100).toFixed(0) + '%'
            // 自定义标签内容为 name + 比重
            return params.name + ' ' + ratio
          }
        },
        tooltip: {
          // 自定义tooltip内容
          formatter: function (params) {
            const ratio =
              ((params.value / count[0].value) * 100).toFixed(0) + '%'
            return params.name + ' ' + ratio // 自定义tooltip内容为 name + 比重
          }
        },
        labelLine: {
          length: 30, // 设置标签线的长度
          lineStyle: {
            color: 'black', // 设置标签线的颜色
            width: 1, // 设置标签线的宽度
            type: 'solid' // 设置标签线的类型为实线
          }
        },
        itemStyle: {
          opacity: 1,
          borderColor: 'transparent'
        },
        data: [
          {
            value: count[0].value,
            name: '',
            itemStyle: { color: '#F74346' },
            label: { show: false }
          },
          {
            value: count[1].value,
            name: '下单转换率',
            itemStyle: { color: '#FFAB2D' }
          },
          {
            value: count[2].value,
            name: '付款转换率',
            itemStyle: { color: '#0398FF' }
          }
        ]
      }
    ]
  }
  return dataSet
}
