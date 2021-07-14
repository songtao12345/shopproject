import {request} from './request'

export function getMenus() {
    return request({
        method: 'get',
        url: '/menus'
    })
}