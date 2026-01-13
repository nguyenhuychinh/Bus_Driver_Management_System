import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import PhanCongList from '../components/phancong/PhanCongList';

function PhanCongPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="page">
          <h1 style={{ marginBottom: '24px' }}>Quản lý Phân Công</h1>
          <PhanCongList />
        </div>
      </div>
    </div>
  );
}

export default PhanCongPage;
