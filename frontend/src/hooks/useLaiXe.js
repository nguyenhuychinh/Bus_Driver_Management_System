import { useState, useCallback } from 'react';
import { laiXeApi } from '../api/laiXeApi';

function useLaiXe() {
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await laiXeApi.getAll();
      setList(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch drivers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await laiXeApi.getById(id);
      setCurrent(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch driver';
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
      console.log('[useLaiXe] Creating driver, payload:', payload);
      const response = await laiXeApi.create(payload);
      console.log('[useLaiXe] Create response:', response.data);
      setList((prevList) => [...prevList, response.data]);
      return response.data;
    } catch (err) {
      console.error('[useLaiXe] Create error:', err);
      console.error('[useLaiXe] Error response:', err.response?.data);
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to create driver';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await laiXeApi.update(id, payload);
      setList((prevList) => prevList.map((item) => (item.id === id ? response.data : item)));
      if (current?.id === id) {
        setCurrent(response.data);
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to update driver';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [current]);

  const removeItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await laiXeApi.remove(id);
      setList((prevList) => prevList.filter((item) => item.id !== id));
      if (current?.id === id) {
        setCurrent(null);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to delete driver';
      setError(errorMessage);
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

export default useLaiXe;
