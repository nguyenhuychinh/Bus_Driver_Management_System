import { useEffect, useState, useMemo } from 'react';
import usePhanCong from '../../hooks/usePhanCong';
import useLaiXe from '../../hooks/useLaiXe';
import useTuyenXe from '../../hooks/useTuyenXe';
import Modal from '../common/Modal';
import Table from '../common/Table';
import Button from '../common/Button';
import Loading from '../common/Loading';
import PhanCongForm from './PhanCongForm';
import PhanCongDetail from './PhanCongDetail';
import { formatDateISO } from '../../utils/formatters';

function PhanCongList() {
  const { list, loading, error, fetchAll, removeItem, fetchById, createItem } = usePhanCong();
  const { list: laiXeList, fetchAll: fetchLaiXe } = useLaiXe();
  const { list: tuyenXeList, fetchAll: fetchTuyenXe } = useTuyenXe();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [sortOption, setSortOption] = useState('ngay_desc');

  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      await Promise.all([fetchAll(), fetchLaiXe(), fetchTuyenXe()]);
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchAll, fetchLaiXe, fetchTuyenXe]);

  const laiXeMap = useMemo(() => {
    const map = new Map();
    laiXeList.forEach((item) => {
      map.set(item.id, item.hoten);
    });
    return map;
  }, [laiXeList]);

  const tuyenXeMap = useMemo(() => {
    const map = new Map();
    tuyenXeList.forEach((item) => {
      map.set(item.id, item.tentuyenxe);
    });
    return map;
  }, [tuyenXeList]);

  const handleCreate = () => {
    setSelectedItem(null);
    setShowCreateModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await removeItem(id);
        handleResetSearch();
        alert('Xóa phân công thành công!');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa';
        alert(errorMessage);
      }
    }
  };

  const handleCreateSubmit = async (payload) => {
    console.log('[PhanCongList] Creating new assignment with payload:', payload);
    try {
      const result = await createItem(payload);
      console.log('[PhanCongList] Create success:', result);
      if (result) {
        setShowCreateModal(false);
        handleResetSearch();
        alert('Thêm phân công thành công!');
      }
    } catch (err) {
      console.error('[PhanCongList] Create error:', err);
      console.error('[PhanCongList] Error response:', err.response?.data);
      throw err;
    }
  };

  const handleFormClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedItem(null);
    handleResetSearch();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const keyword = searchKeyword.trim();
    
    if (!keyword) {
      handleResetSearch();
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      // Check if keyword is all digits (ID search)
      if (/^\d+$/.test(keyword)) {
        console.log('[PhanCongList] Searching by ID:', keyword);
        try {
          const result = await fetchById(Number(keyword));
          if (result) {
            setSearchResults([result]);
            setSearchError(null);
          } else {
            setSearchResults([]);
            setSearchError(`Không tìm thấy tuyến lái có mã = ${keyword}`);
          }
        } catch (err) {
          console.error('[PhanCongList] Search by ID error:', err);
          if (err.response?.status === 404 || err.response?.status === 400) {
            setSearchResults([]);
            setSearchError(`Không tìm thấy tuyến lái có mã = ${keyword}`);
          } else {
            setSearchError('Có lỗi xảy ra khi tìm kiếm theo mã');
            setSearchResults([]);
          }
        }
      } else {
        setSearchResults([]);
        setSearchError('Vui lòng nhập số (mã phân công)');
      }
    } catch (err) {
      console.error('[PhanCongList] Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    setSearchError(null);
    setSearchResults(null);
    fetchAll();
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Determine which list to display and sort
  const displayList = useMemo(() => {
    const baseList = searchResults !== null ? searchResults : list;
    
    // Apply sorting
    const sorted = [...baseList].sort((a, b) => {
      switch (sortOption) {
        case 'ngay_desc':
          return new Date(b.ngay) - new Date(a.ngay);
        case 'ngay_asc':
          return new Date(a.ngay) - new Date(b.ngay);
        case 'laixe_asc': {
          const nameA = laiXeMap.get(a.laixeId) || '';
          const nameB = laiXeMap.get(b.laixeId) || '';
          return nameA.localeCompare(nameB, 'vi');
        }
        case 'tuyenxe_asc': {
          const nameA = tuyenXeMap.get(a.tuyenxeId) || '';
          const nameB = tuyenXeMap.get(b.tuyenxeId) || '';
          return nameA.localeCompare(nameB, 'vi');
        }
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [list, searchResults, sortOption, laiXeMap, tuyenXeMap]);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'ngay', title: 'Ngày' },
    { key: 'laixe', title: 'Lái xe' },
    { key: 'tuyenxe', title: 'Tuyến xe' },
    { key: 'soluotchay', title: 'Số lượt chạy' },
    { key: 'nhienlieu', title: 'Nhiên liệu' },
  ];

  if (isInitialLoading) {
    return <Loading fullscreen />;
  }

  return (
    <div className="page">
      {loading && <Loading fullscreen />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0 }}>Quản lý Phân Công</h1>
        <Button onClick={handleCreate}>Thêm mới</Button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            className="input"
            placeholder="Nhập mã tuyến lái (ID phân công)..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e);
              }
            }}
            style={{ flex: 1 }}
            disabled={searchLoading}
          />
          <Button type="submit" disabled={searchLoading || loading}>
            {searchLoading ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
          {searchKeyword && (
            <Button type="button" variant="ghost" onClick={handleResetSearch} disabled={searchLoading}>
              Reset
            </Button>
          )}
        </form>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Sắp xếp:</label>
          <select
            className="input"
            value={sortOption}
            onChange={handleSortChange}
            style={{ minWidth: '180px' }}
          >
            <option value="ngay_desc">Mới nhất (ngày ↓)</option>
            <option value="ngay_asc">Cũ nhất (ngày ↑)</option>
            <option value="laixe_asc">Theo lái xe (A-Z)</option>
            <option value="tuyenxe_asc">Theo tuyến xe (A-Z)</option>
          </select>
        </div>
      </div>

      {searchError && (
        <div className="error-text" style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#fee', borderRadius: '4px' }}>
          {searchError}
        </div>
      )}

      {error && !searchError && (
        <div className="error-text" style={{ marginBottom: '16px' }}>{error}</div>
      )}

      <Table
        columns={columns}
        data={displayList}
        renderCell={(row, columnKey) => {
          if (columnKey === 'ngay') {
            return row.ngay ? formatDateISO(row.ngay) : '-';
          }
          if (columnKey === 'laixe') {
            return laiXeMap.get(row.laixeId) || '-';
          }
          if (columnKey === 'tuyenxe') {
            return tuyenXeMap.get(row.tuyenxeId) || '-';
          }
          return row[columnKey] ?? '-';
        }}
        actions={(row) => (
          <>
            <Button variant="ghost" onClick={() => handleDetail(row)}>
              Chi tiết
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

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Thêm mới Phân Công">
        <PhanCongForm
          laiXeList={laiXeList}
          tuyenXeList={tuyenXeList}
          onSubmit={handleCreateSubmit}
          onCancel={handleFormClose}
        />
      </Modal>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Sửa Phân Công">
        {selectedItem && (
          <PhanCongForm
            initialData={selectedItem}
            laiXeList={laiXeList}
            tuyenXeList={tuyenXeList}
            onCancel={handleFormClose}
          />
        )}
      </Modal>

      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết Phân Công">
        {selectedItem && (
          <PhanCongDetail
            data={selectedItem}
            laiXeMap={Object.fromEntries(laiXeMap)}
            tuyenXeMap={Object.fromEntries(tuyenXeMap)}
          />
        )}
      </Modal>
    </div>
  );
}

export default PhanCongList;
