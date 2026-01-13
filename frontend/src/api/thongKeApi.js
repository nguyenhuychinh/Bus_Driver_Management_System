import instance from './axiosConfig';

const BASE_URL = '/thongke';

export const thongKeApi = {
  getSummary: () => {
    return instance.get(BASE_URL + '/summary');
  },

  getOverview: () => {
    return instance.get(BASE_URL + '/summary');
  },

  getMonthly: (year) => {
    return instance.get(BASE_URL + '/monthly', { params: { year } });
  },

  getDaily: (startDate, endDate) => {
    return instance.get(BASE_URL + '/daily', { params: { startDate, endDate } });
  },

  getTopDrivers: (limit = 10) => {
    return instance.get(BASE_URL + '/top-drivers', { params: { limit } });
  },
};

export default thongKeApi;
