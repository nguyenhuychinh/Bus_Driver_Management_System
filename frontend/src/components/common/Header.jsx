import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter
      console.log('Search:', searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Tổng quan quản lý lái xe & tuyến</p>
        </div>
      </div>

      <div className="topbar-right">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm lái xe, tuyến, phân công..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        <button
          className="quick-action-btn"
          onClick={() => navigate(ROUTES.PHAN_CONG)}
        >
          <span>+</span>
          <span>Tạo phân công</span>
        </button>

        <div className="user-menu" ref={dropdownRef}>
          <button
            className="user-avatar-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar-circle">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="avatar-name">{user?.username || 'User'}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="dropdown-name">{user?.username || 'User'}</div>
                  <div className="dropdown-email">admin@example.com</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => setShowDropdown(false)}>
                👤 Hồ sơ
              </button>
              <button className="dropdown-item" onClick={() => setShowDropdown(false)}>
                ⚙️ Cài đặt
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                🚪 Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
