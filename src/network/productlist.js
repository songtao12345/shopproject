import {request} from './request'

// 获取商品分类列表
export function getCategoryList(type,pagenum,pagesize) {
    return request({
        method: 'get',
        url: '/categories',
        params: {
            type,
            pagenum,
            pagesize
        }
    })
}

// 添加分类
export function addCategory(cat_pid, cat_name, cat_level) {
    return request({
        method: 'post',
        url: '/categories',
        data: {
            'cat_pid': cat_pid,
            'cat_name': cat_name,
            'cat_level': cat_level
        }
    })
}

//根据Id查询分类
export function getCateById(id) {
    return request({
        method: 'get',
        url: `/categories/${id}`,
        params: {
            id
        }
    })
}

//编辑分类
export function editCategory(id, cat_name) {
    return request({
        method: 'put',
        url: `/categories/${id}`,
        data: {
            'id': id,
            'cat_name': cat_name
        }
    })
}

// 删除分类
export function deleteCategory(id) {
    return request({
        method: 'delete',
        url: `categories/${id}`,
        params: {
            id
        }
    })
}