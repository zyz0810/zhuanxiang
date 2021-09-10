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
/* 获取网格一级分类
 */
export function getFirstCategory(data) {
  return request({
    url: `/admin/map_category/getFirstCategory`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 获取网格二级和子类
 * parent_ids
 */
export function getCategoryList(data) {
  return request({
    url: `/admin/map_category/getCategoryList`,
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

/* 示范小区列表
 * pageSize 分页结束位置
 * page  分页起始位置
 */
export function communityList(data) {
  return request({
    url:'/ai/community/communityList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 示范小区详情
 * id
 */
export function communityDetail(data) {
  return request({
    url:'/ai/community/communityDetail',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加/编辑示范小区
 * name 小区名称
 * mobile 手机号
 * images 封面图
 * point_id 绑定监控点ID
 * linkman 	联系人
 * id 小区ID
 */
export function editCommunity(data) {
  return request({
    url:'/ai/community/editCommunity',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-行政审批
 */
export function implodeCheck(data) {
  return request({
    url:'/admin/excel/implodeCheck',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-数字城管
 */
export function addDigital(data) {
  return request({
    url:'/admin/input_letter/addLetter',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-数字城管-历史数据
 */
export function lightList(data) {
  return request({
    url:'/admin/input_light/lightList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-数字城管-基础数据导入
 */
export function implodeCityManage(obj) {
  const { file, } = obj;
  const data = new FormData();
  data.append("url", file);
  console.log('导入导入')
  console.log(data)
  return request({
    url:'/admin/excel/implodeCityManage',
    method: 'post',
    data: Qs.stringify(data)
  })
}


// /* 批量导入采购商品
//  */
// export function importExcel(obj) {
//   const { file, sn, createTime } = obj;
//   const data = new FormData();
//   data.append("file", file);
//   data.append("sn", sn);
//   data.append("createTime", createTime);
//   return request({
//     url: `/api-product/product/purchase/importExcel`,
//     method: "POST",
//     data: data
//   });
// }

/* 驾驶舱录入-数字城管-重复事件导入
 */
export function implodeRepCityManage(data) {
  return request({
    url:'/admin/excel/implodeRepCityManage',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-信访投诉
 */
export function addLetter(data) {
  return request({
    url:'/admin/input_light/addLight',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-信访投诉-历史数据
 */
export function letterList(data) {
  return request({
    url:'/admin/input_letter/letterList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
