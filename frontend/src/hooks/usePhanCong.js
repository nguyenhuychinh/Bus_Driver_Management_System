import { useState, useCallback } from 'react';
import { phanCongApi } from '../api/phanCongApi';

function usePhanCong() {
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await phanCongApi.getAll();
      setList(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch assignments';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await phanCongApi.getById(id);
      setCurrent(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch assignment';
      setError(errorMessage);
      throw err; // Re-throw for component to handle
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[usePhanCong] Creating assignment, payload:', payload);
      const response = await phanCongApi.create(payload);
      console.log('[usePhanCong] Create response:', response.data);
      setList((prevList) => [...prevList, response.data]);
      return response.data;
    } catch (err) {
      console.error('[usePhanCong] Create error:', err);
      console.error('[usePhanCong] Error response:', err.response?.data);
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to create assignment';
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
      const response = await phanCongApi.update(id, payload);
      setList((prevList) => prevList.map((item) => (item.id === id ? response.data : item)));
      if (current?.id === id) {
        setCurrent(response.data);
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to update assignment';
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
      await phanCongApi.remove(id);
      setList((prevList) => prevList.filter((item) => item.id !== id));
      if (current?.id === id) {
        setCurrent(null);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to delete assignment';
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

export default usePhanCong;
