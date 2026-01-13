import { useMemo } from 'react';
import { formatDateISO, formatCurrencyVND } from '../../utils/formatters';

function DoanhThuChart({ data = [], mode = 'daily' }) {
  const summaryData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const grouped = {};
    
    data.forEach((item) => {
      if (!item.ngaylai) return;
      
      const date = typeof item.ngaylai === 'string' ? item.ngaylai.split('T')[0] : item.ngaylai;
      const dateKey = mode === 'monthly' ? date.substring(0, 7) : date;
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          total: 0,
        };
      }
      
      if (item.doanhthu) {
        grouped[dateKey].total += parseFloat(item.doanhthu) || 0;
      }
    });

    return Object.values(grouped)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
  }, [data, mode]);

  if (summaryData.length === 0) {
    return (
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">Tổng hợp doanh thu</div>
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
          Không có dữ liệu
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="card-title">Tổng hợp doanh thu ({mode === 'monthly' ? 'theo tháng' : 'theo ngày'})</div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{mode === 'monthly' ? 'Tháng' : 'Ngày'}</th>
              <th>Tổng doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((item, index) => (
              <tr key={index}>
                <td>{mode === 'monthly' ? item.date : formatDateISO(item.date)}</td>
                <td>{formatCurrencyVND(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoanhThuChart;
