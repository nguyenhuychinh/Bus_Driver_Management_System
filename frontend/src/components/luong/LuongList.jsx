import { useState, useEffect } from 'react';
import useLaiXe from '../../hooks/useLaiXe';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { luongApi } from '../../api/luongApi';
import { formatCurrencyVND, formatDateISO } from '../../utils/formatters';
import Table from '../common/Table';

function LuongList() {
  const { list: laiXeList, loading: loadingLaiXe, fetchAll: fetchLaiXe } = useLaiXe();
  const [selectedLaiXeId, setSelectedLaiXeId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const [totalData, setTotalData] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLaiXe();
    // Set default dates
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(formatDateISO(firstDay));
    setToDate(formatDateISO(today));
  }, [fetchLaiXe]);

  const handleCalculate = async () => {
    if (!selectedLaiXeId) {
      setError('Vui lòng chọn lái xe');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[LuongList] Calculating salary, laixeId:', selectedLaiXeId, 'from:', fromDate, 'to:', toDate);
      const response = await luongApi.calculate(selectedLaiXeId, fromDate, toDate);
      console.log('[LuongList] Calculate response:', response.data);
      setSalaryData(response.data);
      setError(null);
    } catch (err) {
      console.error('[LuongList] Calculate error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Không thể tính lương. Vui lòng thử lại.';
      setError(errorMessage);
      setSalaryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selectedLaiXeId) {
      setError('Vui lòng chọn lái xe');
      return;
    }

    const amount = parseFloat(payAmount);
    if (!payAmount || isNaN(amount) || amount <= 0) {
      setError('Số tiền thanh toán phải > 0');
      return;
    }

    setLoadingPay(true);
    setError(null);

    try {
      console.log('[LuongList] Paying salary, laixeId:', selectedLaiXeId, 'amount:', amount);
      const response = await luongApi.pay({
        laixeId: parseInt(selectedLaiXeId, 10),
        soTienThanhToan: amount,
      });
      console.log('[LuongList] Pay response:', response.data);
      
      // Update salary data with new values
      if (salaryData) {
        setSalaryData({
          ...salaryData,
          luongDaTra: response.data.luongDaTra,
          luongConNo: response.data.luongConNo,
        });
      }
      
      setPayAmount('');
      alert('Thanh toán lương thành công!');
      setError(null);
    } catch (err) {
      console.error('[LuongList] Pay error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Không thể thanh toán lương. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoadingPay(false);
    }
  };

  const handleCalculateTotal = async () => {
    setLoadingTotal(true);
    setError(null);

    try {
      console.log('[LuongList] Calculating total, from:', fromDate, 'to:', toDate);
      const response = await luongApi.total(fromDate, toDate);
      console.log('[LuongList] Total response:', response.data);
      setTotalData(response.data);
      setError(null);
    } catch (err) {
      console.error('[LuongList] Total error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Không thể tính tổng lương. Vui lòng thử lại.';
      setError(errorMessage);
      setTotalData(null);
    } finally {
      setLoadingTotal(false);
    }
  };

  const handleSaveFile = () => {
    if (!salaryData) {
      alert('Vui lòng tính lương trước khi lưu file');
      return;
    }

    const from = formatDateISO(salaryData.from);
    const to = formatDateISO(salaryData.to);
    const filename = `luong_${from}_${to}.txt`;

    let content = 'BÁO CÁO LƯƠNG LÁI XE\n';
    content += `Khoảng thời gian: ${from} đến ${to}\n`;
    content += '='.repeat(80) + '\n\n';
    content += 'ID | Họ tên | Hệ số | Tổng lượt | Lương phải trả | Đã trả | Còn nợ\n';
    content += '-'.repeat(80) + '\n';
    
    content += `${salaryData.laixeId} | ${salaryData.hoten} | ${salaryData.hesoluong} | ${salaryData.tongLuot} | `;
    content += `${formatCurrencyVND(salaryData.luongPhaiTra)} | ${formatCurrencyVND(salaryData.luongDaTra)} | ${formatCurrencyVND(salaryData.luongConNo)}\n`;
    
    content += '-'.repeat(80) + '\n';
    content += `Tổng: | | | ${salaryData.tongLuot} | ${formatCurrencyVND(salaryData.luongPhaiTra)} | ${formatCurrencyVND(salaryData.luongDaTra)} | ${formatCurrencyVND(salaryData.luongConNo)}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    const mode = window.confirm('Chọn "OK" để Reset đã trả (RESET_PAID_ONLY)\nChọn "Cancel" để hủy');
    if (!mode) return;

    const resetAll = window.confirm('Chọn "OK" để Reset tất cả (RESET_ALL)\nChọn "Cancel" để chỉ Reset đã trả (RESET_PAID_ONLY)');
    const resetMode = resetAll ? 'RESET_ALL' : 'RESET_PAID_ONLY';

    try {
      console.log('[LuongList] Resetting salary, mode:', resetMode);
      const response = await luongApi.reset({ mode: resetMode });
      console.log('[LuongList] Reset response:', response.data);
      alert('Cài lại lương thành công!');
      setSalaryData(null);
      setTotalData(null);
      setPayAmount('');
    } catch (err) {
      console.error('[LuongList] Reset error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Không thể cài lại lương. Vui lòng thử lại.';
      alert(errorMessage);
    }
  };

  return (
    <div className="page">
      {loadingLaiXe && <Loading fullscreen />}

      <h1 style={{ marginBottom: '24px' }}>Quản lý Lương</h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">Tính lương</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-row">
            <label className="label">
              Lái xe <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select
              className="input"
              value={selectedLaiXeId}
              onChange={(e) => setSelectedLaiXeId(e.target.value)}
            >
              <option value="">-- Chọn lái xe --</option>
              {laiXeList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.hoten}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Từ ngày"
            name="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <Input
            label="Đến ngày"
            name="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          {error && <div className="error-text">{error}</div>}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button onClick={handleCalculate} disabled={loading || !selectedLaiXeId}>
              {loading ? 'Đang tính...' : 'Xem lương'}
            </Button>
            <Button onClick={handleCalculateTotal} disabled={loadingTotal} variant="ghost">
              {loadingTotal ? 'Đang tính...' : 'Tính Tổng'}
            </Button>
            {salaryData && (
              <>
                <Button onClick={handleSaveFile} variant="ghost">
                  Lưu
                </Button>
                <Button onClick={handleReset} variant="danger">
                  Cài Lại
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {salaryData && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title">Kết quả tính lương</div>
          <Table
            columns={[
              { key: 'laixeId', title: 'ID' },
              { key: 'hoten', title: 'Họ tên' },
              { key: 'hesoluong', title: 'Hệ số' },
              { key: 'tongLuot', title: 'Tổng lượt' },
              { key: 'donGia', title: 'Đơn giá' },
              { key: 'luongPhaiTra', title: 'Lương phải trả' },
              { key: 'luongDaTra', title: 'Đã trả' },
              { key: 'luongConNo', title: 'Còn nợ' },
            ]}
            data={[salaryData]}
            renderCell={(row, columnKey) => {
              if (columnKey === 'donGia' || columnKey === 'luongPhaiTra' || columnKey === 'luongDaTra' || columnKey === 'luongConNo') {
                return formatCurrencyVND(row[columnKey]);
              }
              return row[columnKey] ?? '-';
            }}
          />

          <div className="card" style={{ marginTop: '16px', backgroundColor: '#f5f5f5' }}>
            <div className="card-title">Thanh toán lương</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Số tiền thanh toán"
                name="payAmount"
                type="number"
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />
              <Button onClick={handlePay} disabled={loadingPay || !payAmount}>
                {loadingPay ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {totalData && (
        <div className="card">
          <div className="card-title">Tổng lương ({formatDateISO(totalData.from)} - {formatDateISO(totalData.to)})</div>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px' }}>
            <dt style={{ fontWeight: 600 }}>Tổng phải trả:</dt>
            <dd style={{ margin: 0 }}>{formatCurrencyVND(totalData.tongLuongPhaiTra)}</dd>
            <dt style={{ fontWeight: 600 }}>Tổng đã trả:</dt>
            <dd style={{ margin: 0 }}>{formatCurrencyVND(totalData.tongLuongDaTra)}</dd>
            <dt style={{ fontWeight: 600 }}>Tổng còn nợ:</dt>
            <dd style={{ margin: 0 }}>{formatCurrencyVND(totalData.tongLuongConNo)}</dd>
          </dl>
        </div>
      )}

      {!salaryData && (
        <div className="card">
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
            Chọn lái xe và khoảng thời gian để xem lương
          </div>
        </div>
      )}
    </div>
  );
}

export default LuongList;
