import request from '@/utils/request'
import Qs from 'qs'
/* 权限类列表
 * auth_name 权限名称
 * pageSize
 * page
 */
export function authList(data) {
  return request({
    url: `/admin/auth/list`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 权限类目-添加
 * auth_name 权限类目名称
 * pid 父权限类目ID
 * remark 权限类目描述
 */
export function authAdd(data) {
  return request({
    url: `/admin/auth/add`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 权限类目-编辑
 * id
 * auth_name 权限类目名称
 * pid 父权限类目ID
 * remark 权限类目描述
 */
export function authEdit(data) {
  return request({
    url: `/admin/auth/edit`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 权限类目-详情
 * id
 */
export function authDetail(data) {
  return request({
    url: `/admin/auth/detail`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 权限类目-修改状态
 * id
 * status 状态
 */
export function authStatus(data) {
  return request({
    url: `/admin/auth/editStatus`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 权限类目-导出
 * auth_name
 */
export function authExport(data) {
  return request({
    url: `/admin/auth/export`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 角色列表
 * auth_name 权限名称
 * pageSize
 * page
 */
export function roleList(data) {
  return request({
    url: `/admin/role/list`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 角色-添加
 * role_name 	角色名称
 * description 描述
 */
export function roleAdd(data) {
  return request({
    url: `/admin/role/add`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 角色-编辑
 * role_name 	角色名称
 * description 描述
 * auth_id 权限ID，多个用逗号分割
 */
export function roleEdit(data) {
  return request({
    url: `/admin/role/edit`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 角色-详情
 * id
 */
export function roleDetail(data) {
  return request({
    url: `/admin/role/detail`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 角色-修改状态
 * status
 */
export function roleStatus(data) {
  return request({
    url: `/admin/role/editStatus`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 角色-导出
 * page
 * pageSize
 * role_name 角色名称
 */
export function roleExport(data) {
  return request({
    url: `/admin/role/export`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}


/* 所有可用角色列表
 */
export function roleAll(data) {
 return request({
   url: `/admin/role/allList`,
   method: 'post',
   data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
 })
}




/* 菜单列表
 * menu_name 菜单名称
 * page
 * pageSize
 */
export function menuList(data) {
  return request({
    url: `/admin/menu/list`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 菜单-添加
 * menu_name 菜单名称
 * sort 排序
 * role_id 角色ID列表，用逗号分隔，0表示全部角色
 * url 链接
 * remark 信息提醒
 */
export function menuAdd(data) {
  return request({
    url: `/admin/menu/add`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 菜单-编辑
 * id
 * menu_name 菜单名称
 * sort 排序
 * role_id 角色ID列表，用逗号分隔，0表示全部角色
 * url 链接
 * remark 信息提醒
 */
export function menuEdit(data) {
  return request({
    url: `/admin/menu/edit`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 菜单-详情
 * id
 */
export function menuDetail(data) {
  return request({
    url: `/admin/menu/detail`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 菜单-修改状态
 * id
 * status 状态
 */
export function menuStatus(data) {
  return request({
    url: `/admin/menu/editStatus`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 菜单-导出
 * menu_name 菜单名称
 */
export function menuExport(data) {
  return request({
    url: `/admin/menu/export`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}



/* 应用授权列表
 * app_name app名称
 * page
 * pageSize
 */
export function authAppList(data) {
  return request({
    url: `/admin/app_auth/list`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 应用授权-修改状态
 * id
 * status 状态
 */
export function authAppStatus(data) {
  return request({
    url: `/admin/app_auth/editStatus`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 应用授权-导出
 * app_name APP名称
 */
export function appAuthExport(data) {
  return request({
    url: `/admin/app_auth/export`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
