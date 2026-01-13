function LaiXeDetail({ data }) {
  if (!data) {
    return <div>Không có dữ liệu</div>;
  }

  return (
    <div className="card">
      <div className="card-title">Thông tin cơ bản</div>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px' }}>
        <dt style={{ fontWeight: 600 }}>Họ tên:</dt>
        <dd style={{ margin: 0 }}>{data.hoten || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Địa chỉ:</dt>
        <dd style={{ margin: 0 }}>{data.diachi || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Trình độ:</dt>
        <dd style={{ margin: 0 }}>{data.trinhdo || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Số điện thoại:</dt>
        <dd style={{ margin: 0 }}>{data.sodienthoai || '-'}</dd>

        <dt style={{ fontWeight: 600 }}>Hệ số lương:</dt>
        <dd style={{ margin: 0 }}>{data.hesoluong ?? '-'}</dd>

        {data.tongsotuyenlai !== undefined && (
          <>
            <dt style={{ fontWeight: 600 }}>Tổng số tuyến lái:</dt>
            <dd style={{ margin: 0 }}>{data.tongsotuyenlai ?? '-'}</dd>
          </>
        )}

        {data.luongphaitra !== undefined && (
          <>
            <dt style={{ fontWeight: 600 }}>Lương phải trả:</dt>
            <dd style={{ margin: 0 }}>{data.luongphaitra ?? '-'}</dd>
          </>
        )}

        {data.luongdatra !== undefined && (
          <>
            <dt style={{ fontWeight: 600 }}>Lương đã trả:</dt>
            <dd style={{ margin: 0 }}>{data.luongdatra ?? '-'}</dd>
          </>
        )}

        {data.luongconno !== undefined && (
          <>
            <dt style={{ fontWeight: 600 }}>Lương còn nợ:</dt>
            <dd style={{ margin: 0 }}>{data.luongconno ?? '-'}</dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default LaiXeDetail;
