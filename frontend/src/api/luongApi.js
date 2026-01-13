import instance from './axiosConfig';

const BASE_URL = '/luong';

export const luongApi = {
  calculate: (laixeId, from, to) => {
    const params = new URLSearchParams();
    params.append('laixeId', laixeId);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return instance.get(BASE_URL + '/calc?' + params.toString());
  },

  pay: (data) => {
    return instance.put(BASE_URL + '/pay', data);
  },

  total: (from, to) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return instance.get(BASE_URL + '/total?' + params.toString());
  },

  reset: (data) => {
    return instance.post(BASE_URL + '/reset', data);
  },
};

export default luongApi;
