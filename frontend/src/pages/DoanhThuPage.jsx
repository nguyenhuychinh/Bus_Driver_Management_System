import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import DoanhThuList from '../components/doanhthu/DoanhThuList';

function DoanhThuPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="page">
          <h1 style={{ marginBottom: '24px' }}>Quản lý Doanh Thu</h1>
          <DoanhThuList />
        </div>
      </div>
    </div>
  );
}

export default DoanhThuPage;
