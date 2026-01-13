import instance from './axiosConfig';

const BASE_URL = '/doanhthu';

export const doanhThuApi = {
  getAll: (params) => {
    const queryParams = new URLSearchParams();
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.direction) queryParams.append('direction', params.direction);
    const queryString = queryParams.toString();
    return instance.get(BASE_URL + (queryString ? '?' + queryString : ''));
  },

  getById: (id) => {
    return instance.get(BASE_URL + '/' + id);
  },

  getDetailById: (id) => {
    return instance.get(BASE_URL + '/' + id + '/detail');
  },

  create: (data) => {
    return instance.post(BASE_URL, data);
  },

  update: (id, data) => {
    return instance.put(BASE_URL + '/' + id, data);
  },

  remove: (id) => {
    return instance.delete(BASE_URL + '/' + id);
  },
};

export default doanhThuApi;
