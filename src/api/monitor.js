import request from '@/utils/request'
import Qs from 'qs'
/* 获取监控点列表
 * pageSize 分页结束位置
 * page  分页起始位置
 * name  设备名称
 * community_id 小区ID
 * type type===allList 没有分页
 */
export function pointList(data) {
  return request({
    url:'/ai/monitory_point/pointList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 修改监控点状态
 * id 监控点ID
 */
export function pointStatus(data) {
  return request({
    url:'/ai/monitory_point/modifyStatus',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 修改监控点
 */
export function editPoint(data) {
  return request({
    url:'/ai/monitory_point/editPoint',
    method: 'post',
    data: Qs.stringify(data)
  })
}
