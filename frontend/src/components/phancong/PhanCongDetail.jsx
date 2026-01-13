import { formatDateISO } from '../../utils/formatters';

function PhanCongDetail({ data, laiXeMap = {}, tuyenXeMap = {} }) {
  if (!data) {
    return <div>Không có dữ liệu</div>;
  }

  const laiXeName = data.laixeId ? (laiXeMap[data.laixeId] || '-') : '-';
  const tuyenXeName = data.tuyenxeId ? (tuyenXeMap[data.tuyenxeId] || '-') : '-';

  return (
    <div className="card">
      <div className="card-title">Thông tin phân công</div>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px' }}>
        <dt style={{ fontWeight: 600 }}>Ngày:</dt>
        <dd style={{ margin: 0 }}>{data.ngay ? formatDateISO(data.ngay) : '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Lái xe:</dt>
        <dd style={{ margin: 0 }}>{laiXeName}</dd>

        <dt style={{ fontWeight: 600 }}>Tuyến xe:</dt>
        <dd style={{ margin: 0 }}>{tuyenXeName}</dd>

        <dt style={{ fontWeight: 600 }}>Số lượt chạy:</dt>
        <dd style={{ margin: 0 }}>{data.soluotchay ?? '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Nhiên liệu:</dt>
        <dd style={{ margin: 0 }}>{data.nhienlieu ?? '-'}</dd>
      </dl>
    </div>
  );
}

export default PhanCongDetail;
