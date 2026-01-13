import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { isRequired, isNonNegativeNumber } from '../../utils/validators';
import { formatCurrencyVND, formatDateISO } from '../../utils/formatters';

const GIA_NHIEN_LIEU = 23000;
const DON_GIA_1_LUOT = 100000;

function DoanhThuForm({ initialData, phanCongList = [], laiXeList = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    phancongId: '',
    ngaylai: '',
    nhienlieu: '',
    tiennhienlieu: '',
    luong: '',
    tongtienve: '',
  });
  const [errors, setErrors] = useState({});
  const [calculatedDoanhThu, setCalculatedDoanhThu] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        phancongId: initialData.phancongId || '',
        ngaylai: initialData.ngaylai ? (typeof initialData.ngaylai === 'string' ? initialData.ngaylai.split('T')[0] : initialData.ngaylai) : '',
        nhienlieu: initialData.nhienlieu || '',
        tiennhienlieu: initialData.tiennhienlieu || '',
        luong: initialData.luong || '',
        tongtienve: initialData.tongtienve || '',
      });
      // Display calculated doanhthu if exists
      if (initialData.doanhthu) {
        setCalculatedDoanhThu(initialData.doanhthu);
      }
    }
  }, [initialData]);

  // Auto-fill fields when phancongId changes
  useEffect(() => {
    if (formData.phancongId && !initialData) {
      const selectedPhanCong = phanCongList.find(item => item.id === parseInt(formData.phancongId, 10));
      if (selectedPhanCong) {
        setFormData(prev => {
          const ngay = selectedPhanCong.ngay || selectedPhanCong.ngayPhanCong || selectedPhanCong.assignmentDate;
          const nhienLieuValue = selectedPhanCong.nhienlieu || selectedPhanCong.nhien_lieu || selectedPhanCong.nhienLieuTieuThu;
          const nhienLieu = nhienLieuValue ? parseFloat(nhienLieuValue) : 0;
          const tienNhienLieu = nhienLieu * GIA_NHIEN_LIEU;
          
          // Get soLuotChay (handle both camelCase and snake_case)
          const soLuotChay = selectedPhanCong.soluotchay || selectedPhanCong.so_luot_chay || selectedPhanCong.soLuotChay || 0;
          
          // Get heSoLuong from LaiXe (handle both camelCase and snake_case)
          const laixeId = selectedPhanCong.laixeId || selectedPhanCong.laixe_id || selectedPhanCong.laiXeId;
          const selectedLaiXe = laixeId ? laiXeList.find(item => item.id === laixeId) : null;
          const heSoLuong = selectedLaiXe 
            ? (selectedLaiXe.hesoluong || selectedLaiXe.he_so_luong || selectedLaiXe.heSoLuong || 1)
            : 1;
          
          // Calculate luong = heSoLuong * soLuotChay * DON_GIA_1_LUOT
          const luong = heSoLuong * soLuotChay * DON_GIA_1_LUOT;
          
          // Format ngay as yyyy-MM-dd for date input
          let ngayFormatted = '';
          if (ngay) {
            if (typeof ngay === 'string') {
              ngayFormatted = ngay.split('T')[0];
            } else {
              ngayFormatted = formatDateISO(ngay);
            }
          }
          
          return {
            ...prev,
            ngaylai: ngayFormatted || prev.ngaylai,
            nhienlieu: nhienLieu > 0 ? nhienLieu.toString() : prev.nhienlieu,
            tiennhienlieu: tienNhienLieu > 0 ? tienNhienLieu.toString() : prev.tiennhienlieu,
            luong: luong > 0 ? luong.toString() : '',
          };
        });
      }
    }
  }, [formData.phancongId, phanCongList, laiXeList, initialData]);

  // Recalculate tienNhienLieu when nhienlieu changes
  useEffect(() => {
    if (formData.nhienlieu && !initialData) {
      const nhienLieu = parseFloat(formData.nhienlieu) || 0;
      const tienNhienLieu = nhienLieu * GIA_NHIEN_LIEU;
      setFormData(prev => ({
        ...prev,
        tiennhienlieu: tienNhienLieu.toString()
      }));
    } else if (!formData.nhienlieu && !initialData) {
      setFormData(prev => ({
        ...prev,
        tiennhienlieu: ''
      }));
    }
  }, [formData.nhienlieu, initialData]);

  // Calculate doanhthu preview when values change
  useEffect(() => {
    const tongTienVe = parseFloat(formData.tongtienve) || 0;
    const luong = parseFloat(formData.luong) || 0;
    const tienNhienLieu = parseFloat(formData.tiennhienlieu) || 0;
    const calculated = tongTienVe - (luong + tienNhienLieu);
    setCalculatedDoanhThu(calculated > 0 ? calculated : 0);
  }, [formData.tongtienve, formData.luong, formData.tiennhienlieu]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!isRequired(formData.phancongId)) {
      newErrors.phancongId = 'Phân công là bắt buộc';
    }
    
    if (!isRequired(formData.ngaylai)) {
      newErrors.ngaylai = 'Ngày lái là bắt buộc';
    }
    
    if (!isRequired(formData.tongtienve)) {
      newErrors.tongtienve = 'Tổng tiền vé là bắt buộc';
    }
    
    const numericFields = ['nhienlieu', 'tiennhienlieu', 'luong', 'tongtienve'];
    numericFields.forEach((field) => {
      if (formData[field] && !isNonNegativeNumber(formData[field])) {
        newErrors[field] = 'Giá trị phải >= 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      phancongId: parseInt(formData.phancongId, 10),
      ngaylai: formData.ngaylai || null,
      nhienlieu: formData.nhienlieu ? parseFloat(formData.nhienlieu) : null,
      tiennhienlieu: formData.tiennhienlieu ? parseFloat(formData.tiennhienlieu) : null,
      luong: formData.luong ? parseFloat(formData.luong) : null,
      tongtienve: parseFloat(formData.tongtienve),
      // DO NOT send doanhthu - backend will calculate it
      // DO NOT send sohanhkhach - removed from form
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="label">
          Phân công <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <select
          className="input"
          name="phancongId"
          value={formData.phancongId}
          onChange={handleChange('phancongId')}
          disabled={!!initialData}
        >
          <option value="">-- Chọn phân công --</option>
          {phanCongList.map((item) => (
            <option key={item.id} value={item.id}>
              ID: {item.id} - Ngày: {item.ngay}
            </option>
          ))}
        </select>
        {errors.phancongId && <div className="error-text">{errors.phancongId}</div>}
      </div>

      <Input
        label="Ngày lái"
        name="ngaylai"
        type="date"
        value={formData.ngaylai}
        onChange={handleChange('ngaylai')}
        error={errors.ngaylai}
        required
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

      <Input
        label="Tiền nhiên liệu (VND)"
        name="tiennhienlieu"
        type="number"
        step="0.01"
        value={formData.tiennhienlieu}
        onChange={handleChange('tiennhienlieu')}
        error={errors.tiennhienlieu}
        disabled
      />

      <Input
        label="Lương (VND)"
        name="luong"
        type="number"
        step="0.01"
        value={formData.luong}
        onChange={handleChange('luong')}
        error={errors.luong}
        disabled
      />

      <Input
        label="Tổng tiền vé (VND)"
        name="tongtienve"
        type="number"
        step="0.01"
        value={formData.tongtienve}
        onChange={handleChange('tongtienve')}
        error={errors.tongtienve}
        required
      />

      {/* Display calculated doanhthu (read-only) */}
      {calculatedDoanhThu !== null && (
        <div className="form-row">
          <label className="label">Doanh thu (tự động tính)</label>
          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontWeight: 600
          }}>
            {formatCurrencyVND(calculatedDoanhThu)}
          </div>
          <div className="help-text" style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
            Doanh thu = Tổng tiền vé - (Lương + Tiền nhiên liệu)
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}

export default DoanhThuForm;
