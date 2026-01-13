import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Sidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/laixe', label: 'Lái Xe', icon: '👤' },
    { path: '/tuyenxe', label: 'Tuyến Xe', icon: '🚌' },
    { path: '/phancong', label: 'Phân Công', icon: '📋' },
    { path: '/luong', label: 'Lương', icon: '💰' },
    { path: '/doanhthu', label: 'Doanh Thu', icon: '📈' },
    { path: '/thongke', label: 'Thống Kê', icon: '📊' },
  ];

  return (
    <aside className="sidebar-dark">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">🚌</div>
          <div className="logo-text">
            <div className="logo-title">Bus Driver</div>
            <div className="logo-subtitle">Management</div>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.username || 'User'}</div>
          <div className="user-role">Administrator</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="nav-indicator"></span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
