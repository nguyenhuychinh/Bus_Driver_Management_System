import { useState, useCallback } from 'react';
import { tuyenXeApi } from '../api/tuyenXeApi';

function useTuyenXe() {
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tuyenXeApi.getAll();
      setList(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch routes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tuyenXeApi.getById(id);
      setCurrent(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch route';
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
      console.log('[useTuyenXe] Creating route, payload:', payload);
      const response = await tuyenXeApi.create(payload);
      console.log('[useTuyenXe] Create response:', response.data);
      setList((prevList) => [...prevList, response.data]);
      return response.data;
    } catch (err) {
      console.error('[useTuyenXe] Create error:', err);
      console.error('[useTuyenXe] Error response:', err.response?.data);
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to create route';
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
      console.log('[useTuyenXe] Updating route ID:', id, 'payload:', payload);
      const response = await tuyenXeApi.update(id, payload);
      console.log('[useTuyenXe] Update response:', response.data);
      setList((prevList) => prevList.map((item) => (item.id === id ? response.data : item)));
      if (current?.id === id) {
        setCurrent(response.data);
      }
      return response.data;
    } catch (err) {
      console.error('[useTuyenXe] Update error:', err);
      console.error('[useTuyenXe] Error response:', err.response?.data);
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to update route';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [current]);

  const removeItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useTuyenXe] Deleting route ID:', id);
      await tuyenXeApi.remove(id);
      setList((prevList) => prevList.filter((item) => item.id !== id));
      if (current?.id === id) {
        setCurrent(null);
      }
    } catch (err) {
      console.error('[useTuyenXe] Delete error:', err);
      console.error('[useTuyenXe] Error response:', err.response?.data);
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to delete route';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [current]);

  const searchItems = useCallback(async (keyword) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useTuyenXe] Searching routes, keyword:', keyword);
      const response = await tuyenXeApi.search(keyword);
      console.log('[useTuyenXe] Search response:', response.data);
      setList(response.data);
      return response.data;
    } catch (err) {
      console.error('[useTuyenXe] Search error:', err);
      console.error('[useTuyenXe] Error response:', err.response?.data);
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Failed to search routes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
    searchItems,
    clearError,
  };
}

export default useTuyenXe;
