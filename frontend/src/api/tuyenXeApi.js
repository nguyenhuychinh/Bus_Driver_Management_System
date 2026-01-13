import instance from './axiosConfig';

const BASE_URL = '/tuyenxe';

export const tuyenXeApi = {
  getAll: () => {
    return instance.get(BASE_URL);
  },

  getById: (id) => {
    return instance.get(BASE_URL + '/' + id);
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

  search: (keyword) => {
    return instance.get(BASE_URL + '/search', { params: { q: keyword } });
  },
};

export default tuyenXeApi;
