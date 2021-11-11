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

/* 获取一级GPS路线
 * category_id 网格对象ID
 */
export function getFirstGap(data) {
  return request({
    url: `/admin/map_category/getFirstGap`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 获取二级GPS路线
 * category_id 网格对象ID
 */
export function getParentGap(data) {
  return request({
    url: `/admin/map_category/getParentGap`,
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
    // data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
    data:data
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
/* 获取网格详情
 */
export function getCategoryDetail(data) {
  return request({
    url: `/admin/map_category/getCategoryDetail`,
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
export function addCommunity(data) {
  return request({
    url:'/ai/community/addCommunity',
    method: 'post',
    data: Qs.stringify(data)
  })
}
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
/* 驾驶舱录入-数字城管-基础数据列表
 * page
 * pageSize
 */
export function cityManagementList(data) {
  return request({
    url:'/admin/import_tool/cityManagementList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-数字城管-重复事件列表
 * page
 * pageSize
 */
export function cityRepManagementList(data) {
  return request({
    url:'/admin/importTool/cityRepManagementList',
    method: 'post',
    data: Qs.stringify(data)
  })
}


/* 驾驶舱录入-信访投诉-基础数据列表
 * page
 * pageSize
 */
export function letterAskList(data) {
  return request({
    url:'/admin/import_tool/letterAskList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-信访投诉-重复事件列表
 * page
 * pageSize
 */
export function letterRepAskList(data) {
  return request({
    url:'/admin/import_tool/letterRepAskList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-行政审核列表
 * page
 * pageSize
 */
export function administrativeCheckList(data) {
  return request({
    url:'/admin/import_tool/administrativeCheckList',
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
export function implodeCityManage(data) {
  // console.log('7777')
  // console.log(obj.file)
  // const { file,} = obj;
  // const data = new FormData();
  // data.append("url", file);
  // console.log('导入导2s入')
  // console.log(data)
  return request({
    url:'/admin/excel/implodeCityManage',
    method: 'post',
    data: data
  })
}
/* 批量导入采购商品
 */
export function importExcel(obj) {
  const { file,} = obj;
  const data = new FormData();
  data.append("url", file);
  // data.append("sn", sn);
  // data.append("createTime", createTime);
  return request({
    url: `/api-product/product/purchase/importExcel`,
    method: "POST",
    data: data
  });
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
/* 驾驶舱录入-信访投诉-基础数据导入
 */
export function implodeLetter(data) {
  return request({
    url:'/admin/excel/implodeLetter',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 驾驶舱录入-信访投诉-重复数据导入
 */
export function implodeRepLetter(data) {
  return request({
    url:'/admin/excel/implodeRepLetter',
    method: 'post',
    data: Qs.stringify(data)
  })
}
// /* 驾驶舱录入-信访投诉-行政审批导入
//  */
// export function implodeCheck(data) {
//   return request({
//     url:'/admin/excel/implodeCheck',
//     method: 'post',
//     data: Qs.stringify(data)
//   })
// }
/* 店铺列表
 */
export function storeList(data) {
  return request({
    url:'/admin/store/storeList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 更改店铺状态
 * id 	商铺ID
 */
export function storeStatus(data) {
  return request({
    url:'/admin/store/changeStatus',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 店铺列表-添加
 */
export function storeAdd(data) {
  return request({
    url:'/admin/store/addStore',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 店铺列表-编辑
 * id
 */
export function storeEdit(data) {
  return request({
    url:'/admin/store/editStore',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 店铺列表-详情
 * id
 */
export function storeDetail(data) {
  return request({
    url:'/admin/store/storeDetail',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 获取店铺违规处罚列表
 * id
 */
export function storeIllegalList(data) {
  return request({
    url:'/admin/store/storeIllegalList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加 店铺违规处罚
 * id
 */
export function addStoreIllegal(data) {
  return request({
    url:'/admin/store/addStoreIllegal',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 获取商铺排查列表
 * store_id
 */
export function storeCheckList(data) {
  return request({
    url:'/admin/store/storeCheckList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加 店铺排查
 * store_id
 */
export function addStoreCheck(data) {
  return request({
    url:'/admin/store/addStoreCheck',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 工地列表
 * key_word
 */
export function buildList(data) {
  return request({
    url:'/admin/building/buildList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 工地详情
 * id
 */
export function buildDetail(data) {
  return request({
    url:'/admin/building/buildDetail',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加工地
 * id
 */
export function buildAdd(data) {
  return request({
    url:'/admin/building/addBuild',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 修改工地
 * id
 */
export function buildEdit(data) {
  return request({
    url:'/admin/building/editBuild',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 获取工地违规处罚列表
 * build_id
 */
export function buildIllegalList(data) {
  return request({
    url:'/admin/building/buildIllegalList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 添加 工地违规处罚
 * build_id
 */
export function addBuildIllegal(data) {
  return request({
    url:'/admin/building/addBuildIllegal',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 更改工地状态
 * id
 */
export function buildStatus(data) {
  return request({
    url:'/admin/building/changeStatus',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 数据字典列表
 * page
 * pageSize
 */
export function dicList(data) {
  return request({
    url:'/admin/dictionary/diclist',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加数据字典一级
 */
export function dicAdd(data) {
  return request({
    url:'/admin/dictionary/addDictionary',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 修改数据字典
 */
export function dicEdit(data) {
  return request({
    url:'/admin/dictionary/editDictionary',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 修改数据字典
 */
export function dicAddEdit(data) {
  return request({
    url:'/admin/dictionary/addAndModify',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 子分类列表
 * key 对应的key值
 */
export function allDictionary(data) {
  return request({
    url:'/admin/dictionary/allDictionary',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 修改数据字典状态
 * id
 */
export function dicStatus(data) {
  return request({
    url:'/admin/dictionary/mofidyStatus',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 获取网格列表
 * page
 * pageSize
 */
export function tableList(data) {
  return request({
    url:'/admin/MapCategory/tableList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 获取井盖列表
 * page
 * pageSize
 * type  allList 没有分页
 * key_word
 */
export function wellLidList(data) {
  return request({
    url:'/admin/well_lid/allList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加井盖
 */
export function addWellLid(data) {
  return request({
    url:'/admin/well_lid/addWellLid',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 修改井盖
 */
export function editWellLid(data) {
  return request({
    url:'/admin/well_lid/editWellLid',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 导入井盖列表
 * 	url
 */
export function implodeWellLid(data) {
  return request({
    url:'/admin/excel/implodeWellLid',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 获取养护单位列表
 * page
 * pageSize
 * type  allList 没有分页
 * key_word
 */
export function conserveList(data) {
  return request({
    url:'/admin/Conserve/allList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加养护单位
 */
export function addConserve(data) {
  return request({
    url:'/admin/Conserve/addConserve',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 编辑养护单位
 */
export function editConserve(data) {
  return request({
    url:'/admin/Conserve/editConserve',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 导入养护单位列表
 * 	url
 */
export function implodeConserve(data) {
  return request({
    url:'/admin/excel/implodeConserve',
    method: 'post',
    data: Qs.stringify(data)
  })
}
