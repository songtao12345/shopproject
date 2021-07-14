import {request} from './request'

// 发送get请求
export function getUserList(query,pagenum,pagesize) {
    return request({
        url: '/users',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

// 发送put请求
export function changeUserList(uId,type) {
    return request({
        method: 'put',
        url: `/users/${uId}/state/${type}`,
        params: {
            uId,
            type
        }
    })

}


// 添加用户请求 post 请求
export function addUserList(username,password,email,mobile) {
    return request({
        method: 'post',
        url: '/users',
        data: {
            'username': username,
            'password': password,
            'email': email,
            'mobile': mobile
        }
    })
}

// 根据ID获取用户信息
export function getUserInfo(id) {
    return request({
        url: `/users/` + id,
        params: {
            id
        }
    })
}

//编辑用户信息
export function editUser(id,email,mobile) {
    return request({
        method: 'put',
        url: `/users/${id}`,
        data: {
            'id': id,
            'email': email,
            'mobile': mobile
        }
    })
}

//删除用户信息
export function deleteUser(id) {
    return request({
        method: 'delete',
        url: `/users/${id}`,
        params: {
            id
        }
    })
}