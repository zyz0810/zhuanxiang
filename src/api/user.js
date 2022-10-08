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
export function updatePassword(data) {
  return request({
    url: `/admin/user/updatePassword`,
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
export function getInfo(data) {
  return request({
    url: `/admin/user/current`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

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
/* 人员-编辑
 * id  用户id
 */
export function userEdit(data) {
  return request({
    url:'/admin/user/edit',
    method: 'post',
    data: Qs.stringify(data)
  })
}


/* 当前登录人员-详情
 */
export function userCurrent(data) {
  return request({
    url:'/admin/user/current',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 人员-详情
 * id  用户id
 */
export function userDetail(data) {
  return request({
    url:'/admin/user/detail',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 人员-修改状态
 * id  用户id
 * status 状态
 */
export function userStatus(data) {
  return request({
    url:'/admin/user/editStatus',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 人员-文化程度
 */
export function userConstants(data) {
  return request({
    url:'/admin/user/constants',
    method: 'post',
    data: Qs.stringify(data)
  })
}

//
/* 人员-导出
 * real_name  人员名称
 * department_id 部门ID
 */
export function userExport(data) {
  return request({
    url:'/admin/user/export',
    method: 'post',
    data: Qs.stringify(data)
  })
}
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
/* 人员-修改密码
 * user_id  用户id
 * password 原密码
 * repwd 新密码
 */
export function editPassword(data) {
  return request({
    url:'/admin/user/editPassword',
    method: 'post',
    data: Qs.stringify(data)
  })
}



