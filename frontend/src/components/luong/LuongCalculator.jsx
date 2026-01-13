import { formatCurrencyVND } from '../../utils/formatters';

function LuongCalculator({ data }) {
  if (!data) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
          Chọn lái xe/khoảng thời gian để xem lương
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Thông tin lương</div>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px' }}>
        {data.tongLuong !== undefined && (
          <>
            <dt style={{ fontWeight: 600 }}>Tổng lương:</dt>
            <dd style={{ margin: 0 }}>{formatCurrencyVND(data.tongLuong)}</dd>
          </>
        )}

        {data.luongPhaiTra !== undefined && (
          <>
            <dt style={{ fontWeight: 600 }}>Lương phải trả:</dt>
            <dd style={{ margin: 0 }}>{formatCurrencyVND(data.luongPhaiTra)}</dd>
          </>
        )}

        {data.luongDaTra !== undefined && (
          <>
            <dt style={{ fontWeight: 600 }}>Lương đã trả:</dt>
            <dd style={{ margin: 0 }}>{formatCurrencyVND(data.luongDaTra)}</dd>
          </>
        )}

        {data.luongConNo !== undefined && (
          <>
            <dt style={{ fontWeight: 600 }}>Lương còn nợ:</dt>
            <dd style={{ margin: 0 }}>{formatCurrencyVND(data.luongConNo)}</dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default LuongCalculator;
