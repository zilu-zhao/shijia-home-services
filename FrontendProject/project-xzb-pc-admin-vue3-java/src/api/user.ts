import { request } from '@/utils/request'
import type { loginResult, userInfoResult } from '@/api/model/userModel'

// 登录
// 账号登录
export const userLogins = (params) =>
  request.post<loginResult>({
    url: `/foundations/open/login`,
    data: params
  })
// 获取用户信息
export const getUserInfo = () =>
  request.get<userInfoResult>({
    url: `/users/me`
  })

// 注册
export function register() {
  return request.post<any>({
    url: '/login'
  })
}
// 个人中心
export function getpersonal() {
  return request.get<any>({
    url: '/get-personal?test=1&name=2',
    params: {
      c: 3
    }
  })
}
// 修改个人信息
export function updatepersonal(params) {
  return request.post<any>({
    url: '/update-personal',
    data: params
  })
}
