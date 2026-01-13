import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Loading from '../components/common/Loading';
import useThongKe from '../hooks/useThongKe';
import ThongKeOverview from '../components/thongke/ThongKeOverview';
import MonthlyChart from '../components/thongke/MonthlyChart';
import DailyChart from '../components/thongke/DailyChart';

function ThongKePage() {
  const { overview, topDrivers, loading, error, fetchOverview, fetchTopDrivers } = useThongKe();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([fetchOverview(), fetchTopDrivers(10)]);
      } catch (err) {
        // Error handled by hook
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, [fetchOverview, fetchTopDrivers]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="page">
          {isInitialLoading && <Loading fullscreen />}
          
          <h1 style={{ marginBottom: '24px' }}>Thống Kê</h1>

          {error && <div className="error-text" style={{ marginBottom: '16px' }}>{error}</div>}

          <ThongKeOverview overview={overview} topDrivers={topDrivers} />
          <MonthlyChart />
          <DailyChart />
        </div>
      </div>
    </div>
  );
}

export default ThongKePage;
