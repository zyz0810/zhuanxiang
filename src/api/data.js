import request from '@/utils/request'
import Qs from 'qs'
/* 获取GPS路线
 * category_id 网格对象ID
 */
export function getGps(data) {
  return request({
    url: `/admin/map_category/getGps`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 画地图添加Gps
 * category_id 网格对象ID
 * type 类型1、街道-社区   2、执法中队   3、市容道路环卫 4、市政道路养护\n5、市政绿化养护 6、河道养护'
 * lat 纬度
 * log 经度
 */
export function addGps(data) {
  return request({
    url: `/admin/map_category/addGps`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 添加父类网格
 * name 父类名称
 * type
 */
export function addCategory(data) {
  return request({
    url: `/admin/map_category/addCategory`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 添加子类网格
 * name 父类名称
 * type
 * parent_id 父类ID
 * depart_id 部门ID
 * table_name 网格名称
 * table_code 网格代码
 * description 描述
 * service_time 服务时间
 */
export function addChildCategory(data) {
  return request({
    url: `/admin/map_category/addChildCategory`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 修改父类网格
 * name 父类名称
 * type
 * id
 */
export function editCategory(data) {
  return request({
    url: `/admin/map_category/editCategory`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 修改子类网格
 * id
 * name 父类名称
 * type
 * parent_id 父类ID
 * depart_id 部门ID
 * table_name 网格名称
 * table_code 网格代码
 * description 描述
 * service_time 服务时间
 */
export function editChildCategory(data) {
  return request({
    url: `/admin/map_category/editChildCategory`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
