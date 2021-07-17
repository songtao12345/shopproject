import {request} from './request'

// 所有权限列表
export function getRightsList() {
    return request({
        method: 'get',
        url: '/rights/list'
        
    })
}

//获取角色列表
export function getRolesList() {
    return request({
        method: 'get',
        url: '/roles'
    })
}

//添加角色列表
export function addRolesList(roleName,roleDesc) {
    return request({
        method: 'post',
        url: '/roles',
        data: {
            'roleName': roleName,
            'roleDesc': roleDesc
        }
    })
}

//获取角色信息
export function getRolesInfo(id) {
    return request({
        method: 'get',
        url: `roles/${id}`,
        params: {
            id
        }
    })
}

//编辑角色信息
export function editRoles(id,roleName,roleDesc) {
    return request({
        method: 'put',
        url:`roles/${id}`,
        data: {
            'id': id,
            'roleName': roleName,
            'roleDesc': roleDesc
        }
    })
}

//删除角色信息
export function deleteRoles(id) {
    return request({
        method: 'delete',
        url: `roles/${id}`,
        params: {
            id
        }
    })
}

// 删除角色权限  
export function deleteRolesRight(roleId,rightId) {
    return request({
        method: 'delete',
        url: `/roles/${roleId}/rights/${rightId}`,
        params: {
            roleId,
            rightId
        }
        
    })
}

//获取角色所有权限
export function getRoleAllRights() {
    return request({
        method: 'get',
        url: `rights/tree`,
        
    })
}

//角色授权
export function assignRoleRights(roleId, rids) {
    return request({
        method: 'post',
        url: `roles/${roleId}/rights`,
        data: {
            'roleId': roleId,
            'rids': rids
        }
    })
}

//分配用户角色
export function assignRoles(id,rid) {
    return request({
        method: 'put',
        url: `users/${id}/role`,
        data: {
            'id': id,
            'rid': rid
        }
    })
}


