function TuyenXeDetail({ data }) {
  if (!data) {
    return <div>Không có dữ liệu</div>;
  }

  return (
    <div className="card">
      <div className="card-title">Thông tin tuyến xe</div>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px' }}>
        <dt style={{ fontWeight: 600 }}>Tên tuyến xe:</dt>
        <dd style={{ margin: 0 }}>{data.tentuyenxe || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Khoảng cách:</dt>
        <dd style={{ margin: 0 }}>{data.khoangcach ?? '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Số điểm dừng:</dt>
        <dd style={{ margin: 0 }}>{data.sodiemdung ?? '-'}</dd>
      </dl>
    </div>
  );
}

export default TuyenXeDetail;
