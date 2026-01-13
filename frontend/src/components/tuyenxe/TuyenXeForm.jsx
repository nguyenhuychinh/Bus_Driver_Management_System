import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { isRequired, isNonNegativeNumber } from '../../utils/validators';

function TuyenXeForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    tentuyenxe: '',
    khoangcach: '',
    sodiemdung: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        tentuyenxe: initialData.tentuyenxe || '',
        khoangcach: initialData.khoangcach || '',
        sodiemdung: initialData.sodiemdung || '',
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
    
    if (!isRequired(formData.tentuyenxe)) {
      newErrors.tentuyenxe = 'Tên tuyến xe là bắt buộc';
    }
    
    if (formData.khoangcach && !isNonNegativeNumber(formData.khoangcach)) {
      newErrors.khoangcach = 'Khoảng cách phải >= 0';
    }
    
    if (formData.sodiemdung && !isNonNegativeNumber(formData.sodiemdung)) {
      newErrors.sodiemdung = 'Số điểm dừng phải >= 0';
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
      tentuyenxe: formData.tentuyenxe,
      khoangcach: formData.khoangcach ? parseFloat(formData.khoangcach) : null,
      sodiemdung: formData.sodiemdung ? parseInt(formData.sodiemdung, 10) : null,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error('[TuyenXeForm] Submit error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Có lỗi xảy ra';
      setErrors({ _general: errorMessage });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {initialData && (
        <Input
          label="ID tuyến xe"
          name="id"
          value={initialData.id || ''}
          disabled
          required={false}
        />
      )}
      {!initialData && (
        <div className="form-row" style={{ marginBottom: '16px' }}>
          <label className="label">ID tuyến xe</label>
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
        label="Tên tuyến xe"
        name="tentuyenxe"
        value={formData.tentuyenxe}
        onChange={handleChange('tentuyenxe')}
        error={errors.tentuyenxe}
        required
      />
      <Input
        label="Khoảng cách (km)"
        name="khoangcach"
        type="number"
        value={formData.khoangcach}
        onChange={handleChange('khoangcach')}
        error={errors.khoangcach}
      />
      <Input
        label="Số điểm dừng"
        name="sodiemdung"
        type="number"
        value={formData.sodiemdung}
        onChange={handleChange('sodiemdung')}
        error={errors.sodiemdung}
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

export default TuyenXeForm;
