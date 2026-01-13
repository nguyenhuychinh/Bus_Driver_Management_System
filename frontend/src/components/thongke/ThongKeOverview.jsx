import { formatCurrencyVND } from '../../utils/formatters';
import Table from '../common/Table';

function ThongKeOverview({ overview, topDrivers = [] }) {
  const cards = [];

  if (overview) {
    if (overview.totalRevenue !== undefined && overview.totalRevenue !== null) {
      cards.push({
        title: 'Tổng doanh thu',
        value: formatCurrencyVND(overview.totalRevenue),
        theme: 'stat-revenue',
      });
    }

    if (overview.totalSalaryPaid !== undefined && overview.totalSalaryPaid !== null) {
      cards.push({
        title: 'Tổng lương đã trả',
        value: formatCurrencyVND(overview.totalSalaryPaid),
        theme: 'stat-salary',
      });
    }

    if (overview.totalTrips !== undefined && overview.totalTrips !== null) {
      cards.push({
        title: 'Tổng lượt',
        value: overview.totalTrips.toString(),
        theme: 'stat-trips',
      });
    }

    if (overview.totalDrivers !== undefined && overview.totalDrivers !== null) {
      cards.push({
        title: 'Tổng lái xe',
        value: overview.totalDrivers.toString(),
        theme: 'stat-drivers',
      });
    }
  }

  const driverColumns = [
    { key: 'hoten', title: 'Họ tên' },
    { key: 'luongdatra', title: 'Lương đã trả' },
    { key: 'tongsotuyenlai', title: 'Tổng số tuyến lái' },
  ];

  return (
    <>
      {cards.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {cards.map((card, index) => (
            <div key={index} className={`stat-card ${card.theme}`}>
              <div className="stat-card-title">{card.title}</div>
              <div className="stat-card-value">
                {card.value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
            Chưa có dữ liệu thống kê
          </div>
        </div>
      )}

      <div className="section-card section-card--drivers" style={{ marginBottom: '24px' }}>
        <div className="card-title">Top Lái Xe</div>
        <Table
          columns={driverColumns}
          data={topDrivers}
          renderCell={(row, columnKey) => {
            if (columnKey === 'luongdatra') {
              return row.luongdatra ? formatCurrencyVND(row.luongdatra) : '-';
            }
            return row[columnKey] ?? '-';
          }}
          emptyText="Không có dữ liệu lái xe"
        />
      </div>
    </>
  );
}

export default ThongKeOverview;
