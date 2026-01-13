import { useState, useEffect, useMemo } from 'react';
import { formatCurrencyVND, formatDateISO } from '../../utils/formatters';
import { thongKeApi } from '../../api/thongKeApi';
import Loading from '../common/Loading';
import Button from '../common/Button';

function DailyChart() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const defaultStart = formatDateISO(lastWeek);
    const defaultEnd = formatDateISO(today);
    
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    
    if (defaultStart && defaultEnd) {
      fetchData(defaultStart, defaultEnd);
    }
  }, []);

  const fetchData = async (start, end) => {
    if (!start || !end) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await thongKeApi.getDaily(start, end);
      setData(response.data.data || {});
      setTotal(response.data.total || 0);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Không thể tải dữ liệu';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  };

  const chartData = useMemo(() => {
    if (!data || typeof data !== 'object') return [];
    
    const entries = Object.entries(data);
    const sorted = entries.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA - dateB;
    });
    
    return sorted.map(([date, revenue]) => ({
      ngay: date,
      doanhThu: revenue,
    }));
  }, [data]);

  const columns = [
    { key: 'ngay', title: 'Ngày' },
    { key: 'doanhThu', title: 'Doanh thu' },
  ];

  return (
    <div className="section-card section-card--daily" style={{ marginBottom: '24px' }}>
      <div className="card-title">Doanh thu theo ngày</div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label className="label">Từ ngày</label>
          <input
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label className="label">Đến ngày</label>
          <input
            type="date"
            className="input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          Xem
        </Button>
      </form>

      {error && (
        <div className="error-text" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {loading && <Loading />}

      {!loading && total !== null && (
        <div style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>
          Tổng: {formatCurrencyVND(total)}
        </div>
      )}

      {!loading && chartData.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
          Không có dữ liệu
        </div>
      )}

      {!loading && chartData.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, index) => (
                <tr key={index}>
                  <td>{row.ngay || '-'}</td>
                  <td>{row.doanhThu ? formatCurrencyVND(row.doanhThu) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DailyChart;
