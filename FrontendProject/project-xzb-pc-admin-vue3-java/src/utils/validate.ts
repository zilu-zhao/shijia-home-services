// 文字字节数限制
export const validateTextLength = (value, maxLimitStr) => {
  // 中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
  const cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/
  let substringStr = ''
  let length = 0
  const strArr = value.split('')
  let obj = {}
  strArr.map((str) => {
    if (cnReg.test(str)) {
      // 中文
      length++
    } else {
      // 英文
      length += 0.5
    }
    // 大于最大限制的时候
    if (length > maxLimitStr) {
      substringStr = substringStr
    } else {
      substringStr += str
    }
  })
  if (length > maxLimitStr) {
    length = maxLimitStr
  }
  return (obj = {
    numVal: Math.floor(length),
    val: substringStr
  })
}
// 调用次数限制
export const validateNum = (val) => {
  const reg = /^[0-9]*$/
  if (reg.test(val) && val <= 999 && val >= 0) {
    return true
  }
  return false
}
// 限制字符5-50
export const validateText = (val) => {
  if (val && val.length >= 5 && val.length <= 50) {
    return true
  }
  return false
}
// 限制字符2-5
export const validateText5 = (val) => {
  if (val && val.length >= 2 && val.length <= 5) {
    return true
  }
  return false
}
// 限制字符2-10
export const validateText10 = (val) => {
  if (val && val.length >= 2 && val.length <= 10) {
    return true
  }
  return false
}
// 验证手机号
export const validatePhone = (val) => {
  const reg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (reg.test(val)) {
    return true
  }
  return false
}
// 验证码
export const validateCode = (val) => {
  const reg = /^\d{6}$/
  if (reg.test(val)) {
    return true
  }
  return false
}
// 限制字符1-500
export const validateText500 = (val) => {
  if (val && val.length >= 1 && val.length <= 500) {
    return true
  }
  return false
}
// 限制字符5-140
export const validateText140 = (val) => {
  if (val && val.length >= 5 && val.length <= 140) {
    return true
  }
  return false
}
// 必须是数字，且最多两位小数，且大于0小于999
export const validateNumber = (val) => {
  const reg = /^([1-9][0-9]{0,2}|0)(\.[0-9]{1,2})?$/
  if (reg.test(val)) {
    return true
  }
  return false
}
// 必须是正整数，且大于0小于100
export const validateNumber100 = (val) => {
  const reg = /^([1-9][0-9]{0,1}|0)$/
  if (reg.test(val) && val <= 100 && val >= 0) {
    return true
  }
  return false
}
// 必须是整数，且大于0小于1440
export const validateNumber1440 = (val) => {
  const reg = /^([1-9][0-9]{0,3}|0)$/
  if (reg.test(val) && val <= 1440 && val > 0) {
    return true
  }
  return false
}
// 必须是整数，且大于0小于500
export const validateNumber500 = (val) => {
  const reg = /^([1-9][0-9]{0,2}|0)$/
  if (reg.test(val) && val <= 500 && val > 0) {
    return true
  }
  return false
}
// 必须是整数，且大于0小于等于100
export const validateNumber100s = (val) => {
  const reg = /^([1-9][0-9]{0,2}|0)$/
  if (reg.test(val) && val <= 100 && val > 0) {
    return true
  }
  return false
}
// 必须是整数，且大于0小于等于1000
export const validateNumber1000 = (val) => {
  const reg = /^([1-9][0-9]{0,3}|0)$/
  if (reg.test(val) && val <= 1000 && val > 0) {
    return true
  }
  return false
}
// 0-20000
export const validateNumber20000 = (val) => {
  const reg = /^([1-9][0-9]{0,4}|0)$/
  if (reg.test(val) && val <= 20000 && val >= 0) {
    return true
  }
  return false
}
