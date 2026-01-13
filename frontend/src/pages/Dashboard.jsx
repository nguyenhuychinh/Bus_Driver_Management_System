import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import MetricCard from '../components/dashboard/MetricCard';
import useLaiXe from '../hooks/useLaiXe';
import useTuyenXe from '../hooks/useTuyenXe';
import usePhanCong from '../hooks/usePhanCong';
import useDoanhThu from '../hooks/useDoanhThu';
import { formatCurrencyVND } from '../utils/formatters';

function Dashboard() {
  const navigate = useNavigate();
  const { list: laiXeList, fetchAll: fetchLaiXe } = useLaiXe();
  const { list: tuyenXeList, fetchAll: fetchTuyenXe } = useTuyenXe();
  const { list: phanCongList, fetchAll: fetchPhanCong } = usePhanCong();
  const { list: doanhThuList, fetchAll: fetchDoanhThu } = useDoanhThu();

  useEffect(() => {
    fetchLaiXe();
    fetchTuyenXe();
    fetchPhanCong();
    fetchDoanhThu();
  }, [fetchLaiXe, fetchTuyenXe, fetchPhanCong, fetchDoanhThu]);

  // Calculate metrics
  const totalLaiXe = laiXeList.length;
  const totalTuyenXe = tuyenXeList.length;
  
  const today = new Date().toISOString().split('T')[0];
  const phanCongToday = phanCongList.filter(
    (pc) => pc.ngay === today
  ).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const doanhThuThang = doanhThuList
    .filter((dt) => {
      if (!dt.ngaylai) return false;
      const dtDate = new Date(dt.ngaylai);
      return dtDate.getMonth() === currentMonth && dtDate.getFullYear() === currentYear;
    })
    .reduce((sum, dt) => sum + (parseFloat(dt.doanhthu) || 0), 0);

  // Recent assignments (last 5)
  const recentPhanCong = phanCongList
    .slice()
    .sort((a, b) => new Date(b.ngay) - new Date(a.ngay))
    .slice(0, 5);

  // Get driver and route names
  const getLaiXeName = (id) => {
    const laiXe = laiXeList.find((lx) => lx.id === id);
    return laiXe?.hoten || 'N/A';
  };

  const getTuyenXeName = (id) => {
    const tuyenXe = tuyenXeList.find((tx) => tx.id === id);
    return tuyenXe?.tentuyenxe || 'N/A';
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="page-content">
          {/* Row 1 - Metric Cards */}
          <div className="metrics-grid">
            <MetricCard
              title="Tổng Lái Xe"
              value={totalLaiXe}
              change="+2"
              changeType="positive"
              icon="👤"
              gradient="gradient-blue"
            />
            <MetricCard
              title="Tổng Tuyến"
              value={totalTuyenXe}
              change="+1"
              changeType="positive"
              icon="🚌"
              gradient="gradient-green"
            />
            <MetricCard
              title="Phân Công Hôm Nay"
              value={phanCongToday}
              change="+3"
              changeType="positive"
              icon="📋"
              gradient="gradient-purple"
            />
            <MetricCard
              title="Doanh Thu Tháng"
              value={formatCurrencyVND(doanhThuThang)}
              change="+12%"
              changeType="positive"
              icon="💰"
              gradient="gradient-orange"
            />
          </div>

          {/* Row 2 - Charts and Stats */}
          <div className="dashboard-row">
            <div className="dashboard-col-large">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">Báo Cáo Doanh Thu</h3>
                  <div className="card-actions">
                    <button className="action-btn">📅 Tháng này</button>
                    <button className="action-btn">📊 Xem chi tiết</button>
                  </div>
                </div>
                <div className="chart-container">
                  <div className="chart-placeholder">
                    <div className="chart-bars">
                      {[65, 80, 75, 90, 85, 95, 100].map((height, i) => (
                        <div
                          key={i}
                          className="chart-bar"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                    <div className="chart-labels">
                      <span>T2</span>
                      <span>T3</span>
                      <span>T4</span>
                      <span>T5</span>
                      <span>T6</span>
                      <span>T7</span>
                      <span>CN</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-col-small">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">Tổng Tuyến</h3>
                </div>
                <div className="stat-value">{totalTuyenXe}</div>
                <div className="stat-label">tuyến đang hoạt động</div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">Phân Công Hôm Nay</h3>
                </div>
                <div className="stat-value">{phanCongToday}</div>
                <div className="stat-label">phân công đã tạo</div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">Doanh Thu</h3>
                </div>
                <div className="stat-value">{formatCurrencyVND(doanhThuThang)}</div>
                <div className="stat-label">tháng này</div>
              </div>
            </div>
          </div>

          {/* Row 3 - Tables */}
          <div className="dashboard-row">
            <div className="dashboard-col-large">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">Phân Công Gần Đây</h3>
                  <button
                    className="action-btn"
                    onClick={() => navigate('/phancong')}
                  >
                    Xem tất cả →
                  </button>
                </div>
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Tuyến</th>
                        <th>Lái Xe</th>
                        <th>Ngày</th>
                        <th>Số Lượt</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPhanCong.length > 0 ? (
                        recentPhanCong.map((pc) => (
                          <tr key={pc.id}>
                            <td>{getTuyenXeName(pc.tuyenxeId)}</td>
                            <td>{getLaiXeName(pc.laixeId)}</td>
                            <td>{pc.ngay || 'N/A'}</td>
                            <td>{pc.soluotchay || 0}</td>
                            <td>
                              <span className="status-badge active">
                                Hoàn thành
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            Chưa có phân công nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="dashboard-col-small">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">Hoạt Động Gần Đây</h3>
                </div>
                <div className="activity-list">
                  {[
                    { icon: '➕', text: 'Tạo phân công mới', time: '5 phút trước' },
                    { icon: '👤', text: 'Thêm lái xe mới', time: '1 giờ trước' },
                    { icon: '🚌', text: 'Cập nhật tuyến xe', time: '2 giờ trước' },
                    { icon: '💰', text: 'Ghi nhận doanh thu', time: '3 giờ trước' },
                  ].map((activity, i) => (
                    <div key={i} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-content">
                        <div className="activity-text">{activity.text}</div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
