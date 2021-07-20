import {request} from './request'

//获取参数列表
export function getParamsList(id,sel) {
    return request({
        method: 'get',
        url: `categories/${id}/attributes`,
        params: {
            id,
            sel
        }
    })
}

//添加参数
export function addParams(id, attr_name, attr_sel, attr_vals) {
    return request({
        method: 'post',
        url: `categories/${id}/attributes`,
        data: {
            'id': id,
            'attr_name': attr_name,
            'attr_sel': attr_sel,
            'attr_vals': attr_vals
        }
    })
}

// 删除参数
export function deleteParams(id, attrid) {
    return request({
        method: 'delete',
        url: `categories/${id}/attributes/${attrid}`,
        params: {
            id,
            attrid
        }
    })
}

// 根据ID查询参数
export function getParamsById(id, attrId) {
    return request({
        method: 'get',
        url: `categories/${id}/attributes/${attrId}`,
        params: {
            id,
            attrId
        }
    })
}

// 提交参数
export function editSubmitParams(id, attrId, attr_name, attr_sel, attr_vals) {
    return request({
        method: 'put',
        url: `categories/${id}/attributes/${attrId}`,
        data: {
            'id': id,
            'attrId': attrId,
            'attr_name': attr_name,
            'attr_sel': attr_sel,
            'attr_vals': attr_vals
        }
    })
}