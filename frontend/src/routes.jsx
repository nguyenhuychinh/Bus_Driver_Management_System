import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import LaiXePage from './pages/LaiXePage';
import TuyenXePage from './pages/TuyenXePage';
import PhanCongPage from './pages/PhanCongPage';
import LuongPage from './pages/LuongPage';
import DoanhThuPage from './pages/DoanhThuPage';
import ThongKePage from './pages/ThongKePage';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/laixe"
        element={
          <PrivateRoute>
            <LaiXePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tuyenxe"
        element={
          <PrivateRoute>
            <TuyenXePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/phancong"
        element={
          <PrivateRoute>
            <PhanCongPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/luong"
        element={
          <PrivateRoute>
            <LuongPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/doanhthu"
        element={
          <PrivateRoute>
            <DoanhThuPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/thongke"
        element={
          <PrivateRoute>
            <ThongKePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default AppRoutes;
