import {request} from './request'

export function getEchartsData() {
    return request({
        method: 'get',
        url: 'reports/type/1'
    })
}