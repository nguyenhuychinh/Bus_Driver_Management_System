import React, { createContext, useState, useMemo, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;

  const login = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(payload);
      const data = response.data;

      const tokenValue = data.token;
      if (!tokenValue) {
        const errorMsg = 'Token not found in response';
        setError(errorMsg);
        return { ok: false, error: errorMsg };
      }

      const userValue = {
        id: data.id,
        username: data.username,
      };

      localStorage.setItem('token', tokenValue);
      localStorage.setItem('user', JSON.stringify(userValue));
      setToken(tokenValue);
      setUser(userValue);

      return { ok: true, token: tokenValue, user: userValue };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Login failed';
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(payload);
      const data = response.data;

      if (data?.token) {
        const tokenValue = data.token;
        const userValue = {
          id: data.id,
          username: data.username,
        };

        localStorage.setItem('token', tokenValue);
        localStorage.setItem('user', JSON.stringify(userValue));
        setToken(tokenValue);
        setUser(userValue);

        return { ok: true, token: tokenValue, user: userValue };
      } else {
        return { ok: true, token: null, user: null };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message || 'Registration failed';
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [token, user, loading, error, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
