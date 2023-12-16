import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/staff/list',
    method: 'get',
    params: query
  })
}

export function add(data) {
  return request({
    url: '/staff/add',
    method: 'post',
    // headers: { 'content-type': 'application/json;charset=UTF-8' },
    // data: JSON.stringify(data)
    data: data
  })
}

export function edit(data) {
  return request({
    url: '/staff/edit',
    method: 'post',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/staff/del',
    method: 'get',
    params: {id:id}
  })
}
