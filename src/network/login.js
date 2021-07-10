import {request} from './request'

export function getLogin(username, password) {
    return request({
        type: 'post',
        url: '/login',
        params: {
            username,
            password
        }
    })
}