import request from '@/utils/request'
import Qs from 'qs'
/* 获取车辆管理列表
 * pageSize 分页结束位置
 * page  分页起始位置
 * type  1、洒水车 2、机扫车
 * key_word 车牌号模糊搜所
 */
export function carList(data) {
  return request({
    url:'/admin/car/carList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
