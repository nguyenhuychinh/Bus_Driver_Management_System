import { useState, useEffect, useMemo } from 'react';
import { formatCurrencyVND } from '../../utils/formatters';
import { thongKeApi } from '../../api/thongKeApi';
import Loading from '../common/Loading';
import Button from '../common/Button';

function MonthlyChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [responseYear, setResponseYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (selectedYear) => {
    setLoading(true);
    setError(null);
    try {
      const response = await thongKeApi.getMonthly(selectedYear);
      setData(response.data.data || {});
      setTotal(response.data.total || 0);
      setResponseYear(response.data.year || selectedYear);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Không thể tải dữ liệu';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (year) {
      fetchData(year);
    }
  };

  const chartData = useMemo(() => {
    if (!data || typeof data !== 'object') return [];
    
    const entries = Object.entries(data);
    const sorted = entries.sort((a, b) => {
      return a[0].localeCompare(b[0]);
    });
    
    return sorted.map(([month, revenue]) => ({
      thang: month,
      doanhThu: revenue,
    }));
  }, [data]);

  const columns = [
    { key: 'thang', title: 'Tháng' },
    { key: 'doanhThu', title: 'Doanh thu' },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear; y >= currentYear - 5; y--) {
    yearOptions.push(y);
  }

  return (
    <div className="section-card section-card--monthly" style={{ marginBottom: '24px' }}>
      <div className="card-title">Doanh thu theo tháng</div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label className="label">Năm</label>
          <select
            className="input"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            required
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
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
          Tổng năm {responseYear || year}: {formatCurrencyVND(total)}
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
                  <td>{row.thang || '-'}</td>
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

export default MonthlyChart;
