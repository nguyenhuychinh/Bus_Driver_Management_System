import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { TRINH_DO_OPTIONS } from '../../utils/constants';
import { isRequired, isNonNegativeNumber } from '../../utils/validators';

function LaiXeForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    hoten: '',
    diachi: '',
    trinhdo: TRINH_DO_OPTIONS[0],
    sodienthoai: '',
    hesoluong: '',
    cccd: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        hoten: initialData.hoten || '',
        diachi: initialData.diachi || '',
        trinhdo: initialData.trinhdo || TRINH_DO_OPTIONS[0],
        sodienthoai: initialData.sodienthoai || '',
        hesoluong: initialData.hesoluong || '',
        cccd: initialData.cccd || '',
      });
    } else {
      setFormData({
        hoten: '',
        diachi: '',
        trinhdo: TRINH_DO_OPTIONS[0],
        sodienthoai: '',
        hesoluong: '',
        cccd: '',
      });
    }
  }, [initialData]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!isRequired(formData.hoten)) {
      newErrors.hoten = 'Họ tên là bắt buộc';
    }
    
    if (!isRequired(formData.cccd)) {
      newErrors.cccd = 'CCCD là bắt buộc';
    } else if (!/^\d{12}$/.test(formData.cccd)) {
      newErrors.cccd = 'CCCD phải là 12 chữ số';
    }
    
    if (formData.hesoluong && !isNonNegativeNumber(formData.hesoluong)) {
      newErrors.hesoluong = 'Hệ số lương phải >= 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      hoten: formData.hoten,
      diachi: formData.diachi || null,
      trinhdo: formData.trinhdo,
      sodienthoai: formData.sodienthoai || null,
      hesoluong: formData.hesoluong ? parseFloat(formData.hesoluong) : null,
      cccd: formData.cccd,
    };

    console.log('[LaiXeForm] Submitting payload:', payload);

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error('[LaiXeForm] Submit error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Có lỗi xảy ra';
      if (err.response?.status === 409) {
        setErrors({ cccd: errorMessage.includes('CCCD') || errorMessage.includes('cccd') ? errorMessage : 'CCCD đã được sử dụng' });
      } else {
        setErrors({ _general: errorMessage });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {initialData && (
        <Input
          label="Mã lái xe (ID)"
          name="id"
          value={initialData.id || ''}
          disabled
          required={false}
        />
      )}
      {!initialData && (
        <div className="form-row" style={{ marginBottom: '16px' }}>
          <label className="label">Mã lái xe (ID)</label>
          <input
            type="text"
            className="input"
            value="Tự động"
            disabled
            style={{ backgroundColor: '#f5f5f5', color: '#666' }}
          />
        </div>
      )}
      <Input
        label="Họ tên"
        name="hoten"
        value={formData.hoten}
        onChange={handleChange('hoten')}
        error={errors.hoten}
        required
      />
      <Input
        label="Căn cước công dân (CCCD)"
        name="cccd"
        value={formData.cccd}
        onChange={handleChange('cccd')}
        error={errors.cccd}
        maxLength={12}
        required
      />
      <Input
        label="Địa chỉ"
        name="diachi"
        value={formData.diachi}
        onChange={handleChange('diachi')}
        error={errors.diachi}
      />
      <div className="form-row">
        <label className="label">
          Trình độ <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <select
          className="input"
          name="trinhdo"
          value={formData.trinhdo}
          onChange={handleChange('trinhdo')}
        >
          {TRINH_DO_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.trinhdo && <div className="error-text">{errors.trinhdo}</div>}
      </div>
      <Input
        label="Số điện thoại"
        name="sodienthoai"
        value={formData.sodienthoai}
        onChange={handleChange('sodienthoai')}
        error={errors.sodienthoai}
      />
      <Input
        label="Hệ số lương"
        name="hesoluong"
        type="number"
        value={formData.hesoluong}
        onChange={handleChange('hesoluong')}
        error={errors.hesoluong}
      />
      {errors._general && (
        <div className="alert alert-danger" style={{ marginTop: '16px' }}>
          {errors._general}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData ? 'Lưu' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}

export default LaiXeForm;
