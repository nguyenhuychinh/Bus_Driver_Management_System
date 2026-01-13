import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { isRequired } from '../../utils/validators';

function Login() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!isRequired(formData.username)) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    }
    if (!isRequired(formData.password)) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    const result = await login({ username: formData.username, password: formData.password });
    setSubmitting(false);

    if (result.ok) {
      navigate('/');
    }
  };

  const isLoading = loading || submitting;

  return (
    <div className="auth-shell">
      <div className="auth-grid">
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Đăng nhập</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Tên đăng nhập"
              name="username"
              value={formData.username}
              onChange={handleChange('username')}
              error={errors.username}
              required
            />
            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
            />
            {authError && (
              <div className="alert alert-danger">{authError}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              {isLoading && <Loading />}
              <Button type="submit" disabled={isLoading}>
                Đăng nhập
              </Button>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <Link to="/register" className="auth-link">
                  Chưa có tài khoản? Đăng ký
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div className="auth-panel">
          <div className="auth-brand">Bus Driver Management</div>
          <div className="auth-subtitle">
            Hệ thống quản lý lái xe và doanh thu cho công ty vận tải
          </div>
          <ul className="auth-features">
            <li>Quản lý thông tin lái xe</li>
            <li>Theo dõi phân công tuyến đường</li>
            <li>Tính toán lương và doanh thu</li>
            <li>Thống kê và báo cáo chi tiết</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
