import { useEffect, useState } from 'react';
import useDoanhThu from '../../hooks/useDoanhThu';
import usePhanCong from '../../hooks/usePhanCong';
import useLaiXe from '../../hooks/useLaiXe';
import Modal from '../common/Modal';
import Table from '../common/Table';
import Button from '../common/Button';
import Loading from '../common/Loading';
import DoanhThuForm from './DoanhThuForm';
import DoanhThuDetail from './DoanhThuDetail';
import DoanhThuChart from './DoanhThuChart';
import { formatDateISO, formatCurrencyVND } from '../../utils/formatters';
import { doanhThuApi } from '../../api/doanhThuApi';

function DoanhThuList() {
  const { list, loading, error, fetchAll, removeItem, createItem, updateItem, fetchById } = useDoanhThu();
  const { list: phanCongList, fetchAll: fetchPhanCong } = usePhanCong();
  const { list: laiXeList, fetchAll: fetchLaiXe } = useLaiXe();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sortOption, setSortOption] = useState('ngaylai_desc');
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      await Promise.all([fetchAll(), fetchPhanCong(), fetchLaiXe()]);
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchAll, fetchPhanCong, fetchLaiXe]);

  useEffect(() => {
    // Apply sorting
    const applySort = async () => {
      const [sortField, sortDirection] = sortOption.split('_');
      try {
        const response = await doanhThuApi.getAll({ sort: sortField, direction: sortDirection });
        // Update list manually since hook doesn't expose setList
        fetchAll();
      } catch (err) {
        console.error('[DoanhThuList] Sort error:', err);
      }
    };
    if (!isInitialLoading) {
      applySort();
    }
  }, [sortOption, isInitialLoading, fetchAll]);

  const handleCreate = () => {
    setSelectedItem(null);
    setShowCreateModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDetail = async (item) => {
    setSelectedItem(item);
    setLoadingDetail(true);
    try {
      const response = await doanhThuApi.getById(item.id);
      setDetailData(response.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('[DoanhThuList] Detail error:', err);
      alert('Không thể tải thông tin chi tiết');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await removeItem(id);
        alert('Xóa doanh thu thành công!');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa';
        alert(errorMessage);
      }
    }
  };

  const handleCreateSubmit = async (payload) => {
    try {
      console.log('[DoanhThuList] Creating doanh thu, payload:', payload);
      await createItem(payload);
      alert('Thêm doanh thu thành công!');
      setShowCreateModal(false);
      fetchAll();
    } catch (err) {
      console.error('[DoanhThuList] Create error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Có lỗi xảy ra khi tạo';
      alert(errorMessage);
    }
  };

  const handleUpdateSubmit = async (payload) => {
    try {
      console.log('[DoanhThuList] Updating doanh thu, id:', selectedItem.id, 'payload:', payload);
      await updateItem(selectedItem.id, payload);
      alert('Cập nhật doanh thu thành công!');
      setShowEditModal(false);
      setSelectedItem(null);
      fetchAll();
    } catch (err) {
      console.error('[DoanhThuList] Update error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Có lỗi xảy ra khi cập nhật';
      alert(errorMessage);
    }
  };

  const handleFormClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const columns = [
    { key: 'ngaylai', title: 'Ngày lái' },
    { key: 'phancongId', title: 'Phân công ID' },
    { key: 'tiennhienlieu', title: 'Tiền nhiên liệu' },
    { key: 'luong', title: 'Lương' },
    { key: 'tongtienve', title: 'Tổng tiền vé' },
    { key: 'doanhthu', title: 'Doanh thu' },
  ];

  if (isInitialLoading) {
    return <Loading fullscreen />;
  }

  return (
    <div className="page">
      {loading && <Loading fullscreen />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0 }}>Quản lý Doanh Thu</h1>
        <Button onClick={handleCreate}>Thêm mới</Button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
        <label className="label" style={{ margin: 0 }}>Sắp xếp:</label>
        <select className="input" value={sortOption} onChange={handleSortChange} style={{ width: '200px' }}>
          <option value="ngaylai_desc">Ngày lái (mới nhất)</option>
          <option value="ngaylai_asc">Ngày lái (cũ nhất)</option>
          <option value="doanhThu_desc">Doanh thu (cao → thấp)</option>
          <option value="doanhThu_asc">Doanh thu (thấp → cao)</option>
        </select>
      </div>

      {error && <div className="error-text" style={{ marginBottom: '16px' }}>{error}</div>}

      <DoanhThuChart data={list} />

      <Table
        columns={columns}
        data={list}
        renderCell={(row, columnKey) => {
          if (columnKey === 'ngaylai') {
            return row.ngaylai ? formatDateISO(row.ngaylai) : '-';
          }
          if (columnKey === 'tiennhienlieu' || columnKey === 'luong' || columnKey === 'tongtienve' || columnKey === 'doanhthu') {
            return row[columnKey] ? formatCurrencyVND(row[columnKey]) : '-';
          }
          return row[columnKey] ?? '-';
        }}
        actions={(row) => (
          <>
            <Button variant="ghost" onClick={() => handleDetail(row)}>
              Thông tin
            </Button>
            <Button variant="ghost" onClick={() => handleEdit(row)}>
              Sửa
            </Button>
            <Button variant="danger" onClick={() => handleDelete(row.id)}>
              Xóa
            </Button>
          </>
        )}
      />

      <Modal open={showCreateModal} onClose={handleFormClose} title="Thêm mới Doanh Thu">
        <DoanhThuForm 
          phanCongList={phanCongList}
          laiXeList={laiXeList}
          onSubmit={handleCreateSubmit}
          onCancel={handleFormClose} 
        />
      </Modal>

      <Modal open={showEditModal} onClose={handleFormClose} title="Sửa Doanh Thu">
        {selectedItem && (
          <DoanhThuForm 
            initialData={selectedItem} 
            phanCongList={phanCongList}
            laiXeList={laiXeList}
            onSubmit={handleUpdateSubmit}
            onCancel={handleFormClose} 
          />
        )}
      </Modal>

      <Modal open={showDetailModal} onClose={() => { setShowDetailModal(false); setDetailData(null); }} title="Thông tin Doanh Thu">
        {loadingDetail ? (
          <Loading />
        ) : detailData ? (
          <DoanhThuDetail data={detailData} />
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Modal>
    </div>
  );
}

export default DoanhThuList;
