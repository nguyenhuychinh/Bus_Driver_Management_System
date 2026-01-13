import { useState, useCallback } from 'react';
import { thongKeApi } from '../api/thongKeApi';

function useThongKe() {
  const [overview, setOverview] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [topDrivers, setTopDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await thongKeApi.getSummary();
      setOverview(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch overview';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMonthly = useCallback(async (year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await thongKeApi.getMonthly(year);
      setMonthly(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch monthly data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDaily = useCallback(async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await thongKeApi.getDaily(startDate, endDate);
      setDaily(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch daily data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopDrivers = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await thongKeApi.getTopDrivers(limit);
      setTopDrivers(response.data.drivers || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch top drivers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    overview,
    monthly,
    daily,
    topDrivers,
    loading,
    error,
    fetchOverview,
    fetchMonthly,
    fetchDaily,
    fetchTopDrivers,
    clearError,
  };
}

export default useThongKe;
