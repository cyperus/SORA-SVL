import request from '../utils/request';

export function listVehicles() {
  return request({
    url: '/api/v1/vehicles',
    method: 'get',
  });
}
export function listMaps() {
  return request({
    url: '/api/v1/maps',
    method: 'get',
  });
}
