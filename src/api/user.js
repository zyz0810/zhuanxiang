import request from '@/utils/request'
import Qs from 'qs'
export function login(data) {
  return request({
    // url: 'api-auth/oauth/platform/login',
    url: '/admin/login/index',
    method: 'post',
    // data
    data: Qs.stringify(data)
  })
}

/*移除token
 * access_token
 */
export function logout(data) {
  return request({
    url: '/admin/user/logout',
    // url: 'api/logout',
    method: 'post',
    data: Qs.stringify(data)
  })
}
// export function getInfo(account_id) {
//   return request({
//     url: `/api/account/${account_id}/permissions`,
//     method: 'get'
//   })
// }
// export function getInfo() {
//   return request({
//     url:'api-user/users/current',
//     method: 'get'
//   })
// }

/* 忘记密码
 * confirmPassword  确认密码
 * mobile 手机号
 * password 密码
 * verifyCode 验证码
 */
// export function updatePassword(data) {
//   return request({
//     url:'api-user/users/forgetPassword',
//     method: 'post',
//     data: Qs.stringify(data)
//   })
// }



/* 人员-列表
 * department_id  部门ID
 * real_name 人员名称
 * page
 * pageSize
 */
export function userList(data) {
  return request({
    url:'/admin/user/list',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 人员-添加
 * department_id  部门ID
 * gender 性别(1:男;2:女)
 * user_name 登录名
 * real_name
 */
export function userAdd(data) {
  return request({
    url:'/admin/user/add',
    method: 'post',
    data: Qs.stringify(data)
  })
}
// /* 人员-重置密码
//  * id  用户id
//  */
// export function resetPassword(data) {
//   return request({
//     url:'/admin/user/resetPassword',
//     method: 'post',
//     data: Qs.stringify(data)
//   })
// }
// /* 人员-重置密码
//  * id  用户id
//  */
// export function resetPassword(data) {
//   return request({
//     url:'/admin/user/resetPassword',
//     method: 'post',
//     data: Qs.stringify(data)
//   })
// }
//
//
//
/* 人员-重置密码
 * id  用户id
 */
export function resetPassword(data) {
  return request({
    url:'/admin/user/resetPassword',
    method: 'post',
    data: Qs.stringify(data)
  })
}



