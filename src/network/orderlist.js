import {request} from './request'

// 获取订单列表数据
export function getOrderList(query,pagenum,pagesize) {
    return request({
        method: 'get',
        url: 'orders',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}
// 查询物流信息
export function getProgessInfo(id) {
    return request({
        method: 'get',
        url: `/kuaidi/${id}`,
        params: {
            id
        }
        
    })
}