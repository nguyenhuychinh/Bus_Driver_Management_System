import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import LaiXeList from '../components/laixe/LaiXeList';

function LaiXePage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="page">
          <h1 style={{ marginBottom: '24px' }}>Quản lý Lái Xe</h1>
          <LaiXeList />
        </div>
      </div>
    </div>
  );
}

export default LaiXePage;
