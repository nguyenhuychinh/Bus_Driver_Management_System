import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import LuongList from '../components/luong/LuongList';

function LuongPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="page">
          <h1 style={{ marginBottom: '24px' }}>Quản lý Lương</h1>
          <LuongList />
        </div>
      </div>
    </div>
  );
}

export default LuongPage;
