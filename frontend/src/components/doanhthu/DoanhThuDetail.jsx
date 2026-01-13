import { formatCurrencyVND, formatDateISO } from '../../utils/formatters';

function DoanhThuDetail({ data, phanCongMap }) {
  if (!data) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px' }}>
        <dt style={{ fontWeight: 600 }}>Ngày lái:</dt>
        <dd style={{ margin: 0 }}>{data.ngaylai ? formatDateISO(data.ngaylai) : '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Phân công ID:</dt>
        <dd style={{ margin: 0 }}>{data.phancongId || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Lái xe:</dt>
        <dd style={{ margin: 0 }}>{data.laiXeHoten || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Tuyến xe:</dt>
        <dd style={{ margin: 0 }}>{data.tuyenXeTen || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Nhiên liệu:</dt>
        <dd style={{ margin: 0 }}>{data.nhienlieu || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Tiền nhiên liệu:</dt>
        <dd style={{ margin: 0 }}>{data.tiennhienlieu ? formatCurrencyVND(data.tiennhienlieu) : '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Lương:</dt>
        <dd style={{ margin: 0 }}>{data.luong ? formatCurrencyVND(data.luong) : '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Tổng tiền vé:</dt>
        <dd style={{ margin: 0 }}>{data.tongtienve ? formatCurrencyVND(data.tongtienve) : '-'}</dd>

        <dt style={{ fontWeight: 600, color: 'var(--primary)' }}>Doanh thu:</dt>
        <dd style={{ margin: 0, fontWeight: 600, color: 'var(--primary)' }}>
          {data.doanhthu ? formatCurrencyVND(data.doanhthu) : '-'}
        </dd>
      </dl>
    </div>
  );
}

export default DoanhThuDetail;
