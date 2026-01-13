import instance from './axiosConfig';

const BASE_URL = '/auth';

export const authApi = {
  login: (data) => {
    return instance.post(BASE_URL + '/login', data);
  },

  register: (data) => {
    return instance.post(BASE_URL + '/register', data);
  },
};

export default authApi;
