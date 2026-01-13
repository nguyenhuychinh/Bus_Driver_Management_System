import { useState, useCallback } from 'react';
import { doanhThuApi } from '../api/doanhThuApi';

function useDoanhThu() {
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (sortParams = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doanhThuApi.getAll(sortParams || {});
      setList(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch revenue records';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doanhThuApi.getById(id);
      setCurrent(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch revenue record';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doanhThuApi.create(payload);
      setList((prevList) => [...prevList, response.data]);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to create revenue record';
      setError(errorMessage);
      throw err; // Re-throw for component to handle
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doanhThuApi.update(id, payload);
      setList((prevList) => prevList.map((item) => (item.id === id ? response.data : item)));
      if (current?.id === id) {
        setCurrent(response.data);
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to update revenue record';
      setError(errorMessage);
      throw err; // Re-throw for component to handle
    } finally {
      setLoading(false);
    }
  }, [current]);

  const removeItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await doanhThuApi.remove(id);
      setList((prevList) => prevList.filter((item) => item.id !== id));
      if (current?.id === id) {
        setCurrent(null);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to delete revenue record';
      setError(errorMessage);
      throw err; // Re-throw for component to handle
    } finally {
      setLoading(false);
    }
  }, [current]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    list,
    current,
    loading,
    error,
    fetchAll,
    fetchById,
    createItem,
    updateItem,
    removeItem,
    clearError,
  };
}

export default useDoanhThu;
