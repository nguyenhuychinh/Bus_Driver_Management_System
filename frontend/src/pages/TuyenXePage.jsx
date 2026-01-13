import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import TuyenXeList from '../components/tuyenxe/TuyenXeList';

function TuyenXePage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="page">
          <h1 style={{ marginBottom: '24px' }}>Quản lý Tuyến Xe</h1>
          <TuyenXeList />
        </div>
      </div>
    </div>
  );
}

export default TuyenXePage;
