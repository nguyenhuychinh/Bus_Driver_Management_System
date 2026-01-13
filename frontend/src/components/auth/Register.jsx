import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { isRequired, isEmail, minLength } from '../../utils/validators';

function Register() {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    pass: '',
    confirmPass: '',
  });
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
    
    if (!isRequired(formData.fullname)) {
      newErrors.fullname = 'Họ tên là bắt buộc';
    }
    
    if (!isRequired(formData.username)) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    }
    
    if (!isRequired(formData.email)) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!isEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!isRequired(formData.pass)) {
      newErrors.pass = 'Mật khẩu là bắt buộc';
    } else if (!minLength(formData.pass, 6)) {
      newErrors.pass = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!isRequired(formData.confirmPass)) {
      newErrors.confirmPass = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.pass !== formData.confirmPass) {
      newErrors.confirmPass = 'Mật khẩu xác nhận không khớp';
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
    const result = await register({
      fullName: formData.fullname,
      username: formData.username,
      email: formData.email,
      password: formData.pass,
    });
    setSubmitting(false);

    if (result.ok) {
      if (result.token) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  };

  const isLoading = loading || submitting;

  return (
    <div className="auth-shell">
      <div className="auth-grid">
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Đăng ký</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Họ tên"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange('fullname')}
              error={errors.fullname}
              required
            />
            <Input
              label="Tên đăng nhập"
              name="username"
              value={formData.username}
              onChange={handleChange('username')}
              error={errors.username}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
            />
            <Input
              label="Mật khẩu"
              name="pass"
              type="password"
              value={formData.pass}
              onChange={handleChange('pass')}
              error={errors.pass}
              required
            />
            <Input
              label="Xác nhận mật khẩu"
              name="confirmPass"
              type="password"
              value={formData.confirmPass}
              onChange={handleChange('confirmPass')}
              error={errors.confirmPass}
              required
            />
            {authError && (
              <div className="alert alert-danger">{authError}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              {isLoading && <Loading />}
              <Button type="submit" disabled={isLoading}>
                Đăng ký
              </Button>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div className="auth-panel">
          <div className="auth-brand">Tạo tài khoản mới</div>
          <div className="auth-subtitle">
            Đăng ký để bắt đầu sử dụng hệ thống quản lý lái xe và doanh thu
          </div>
          <ul className="auth-features">
            <li>Truy cập vào tất cả các tính năng</li>
            <li>Quản lý dữ liệu an toàn và bảo mật</li>
            <li>Giao diện trực quan và dễ sử dụng</li>
            <li>Hỗ trợ đầy đủ các chức năng quản lý</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;
