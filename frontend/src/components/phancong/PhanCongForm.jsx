import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { isRequired, isNonNegativeNumber } from '../../utils/validators';

function PhanCongForm({ initialData, laiXeList = [], tuyenXeList = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    laixeId: '',
    tuyenxeId: '',
    ngay: '',
    soluotchay: '',
    nhienlieu: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        laixeId: initialData.laixeId || '',
        tuyenxeId: initialData.tuyenxeId || '',
        ngay: initialData.ngay ? (typeof initialData.ngay === 'string' ? initialData.ngay.split('T')[0] : initialData.ngay) : '',
        soluotchay: initialData.soluotchay || '',
        nhienlieu: initialData.nhienlieu || '',
      });
    } else {
      setFormData({
        laixeId: '',
        tuyenxeId: '',
        ngay: '',
        soluotchay: '',
        nhienlieu: '',
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
    
    if (!isRequired(formData.laixeId)) {
      newErrors.laixeId = 'Lái xe là bắt buộc';
    }
    
    if (!isRequired(formData.tuyenxeId)) {
      newErrors.tuyenxeId = 'Tuyến xe là bắt buộc';
    }
    
    if (!isRequired(formData.ngay)) {
      newErrors.ngay = 'Ngày là bắt buộc';
    }
    
    if (formData.soluotchay && !isNonNegativeNumber(formData.soluotchay)) {
      newErrors.soluotchay = 'Số lượt chạy phải >= 0';
    }
    
    if (formData.nhienlieu && !isNonNegativeNumber(formData.nhienlieu)) {
      newErrors.nhienlieu = 'Nhiên liệu phải >= 0';
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
      laixeId: parseInt(formData.laixeId, 10),
      tuyenxeId: parseInt(formData.tuyenxeId, 10),
      ngay: formData.ngay,
      soluotchay: formData.soluotchay ? parseInt(formData.soluotchay, 10) : null,
      nhienlieu: formData.nhienlieu ? parseFloat(formData.nhienlieu) : null,
    };

    console.log('[PhanCongForm] Submitting payload:', payload);

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error('[PhanCongForm] Submit error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Có lỗi xảy ra';
      if (err.response?.status === 409) {
        setErrors({ _general: errorMessage.includes('Phân công') ? errorMessage : 'Phân công đã tồn tại (trùng lái xe + tuyến xe + ngày)' });
      } else {
        setErrors({ _general: errorMessage });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="label">
          Lái xe <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <select
          className="input"
          name="laixeId"
          value={formData.laixeId}
          onChange={handleChange('laixeId')}
        >
          <option value="">-- Chọn lái xe --</option>
          {laiXeList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.hoten}
            </option>
          ))}
        </select>
        {errors.laixeId && <div className="error-text">{errors.laixeId}</div>}
      </div>

      <div className="form-row">
        <label className="label">
          Tuyến xe <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <select
          className="input"
          name="tuyenxeId"
          value={formData.tuyenxeId}
          onChange={handleChange('tuyenxeId')}
        >
          <option value="">-- Chọn tuyến xe --</option>
          {tuyenXeList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.tentuyenxe}
            </option>
          ))}
        </select>
        {errors.tuyenxeId && <div className="error-text">{errors.tuyenxeId}</div>}
      </div>

      <Input
        label="Ngày"
        name="ngay"
        type="date"
        value={formData.ngay}
        onChange={handleChange('ngay')}
        error={errors.ngay}
        required
      />

      <Input
        label="Số lượt chạy"
        name="soluotchay"
        type="number"
        value={formData.soluotchay}
        onChange={handleChange('soluotchay')}
        error={errors.soluotchay}
      />

      <Input
        label="Nhiên liệu (lít)"
        name="nhienlieu"
        type="number"
        step="0.01"
        value={formData.nhienlieu}
        onChange={handleChange('nhienlieu')}
        error={errors.nhienlieu}
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

export default PhanCongForm;
