import instance from './axiosConfig';

const BASE_URL = '/phancong';

export const phanCongApi = {
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
};

export default phanCongApi;
