import { useEffect, useState } from 'react';
import useTuyenXe from '../../hooks/useTuyenXe';
import Modal from '../common/Modal';
import Table from '../common/Table';
import Button from '../common/Button';
import Loading from '../common/Loading';
import TuyenXeForm from './TuyenXeForm';
import TuyenXeDetail from './TuyenXeDetail';

function TuyenXeList() {
  const { list, loading, error, fetchAll, createItem, updateItem, removeItem, searchItems, fetchById } = useTuyenXe();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
        alert('Xóa tuyến xe thành công!');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa';
        alert(errorMessage);
      }
    }
  };

  const handleCreateSubmit = async (payload) => {
    console.log('[TuyenXeList] Creating new route with payload:', payload);
    try {
      const result = await createItem(payload);
      console.log('[TuyenXeList] Create success:', result);
      if (result) {
        setShowCreateModal(false);
        handleResetSearch();
        alert('Thêm tuyến xe thành công!');
      }
    } catch (err) {
      console.error('[TuyenXeList] Create error:', err);
      throw err;
    }
  };

  const handleUpdateSubmit = async (payload) => {
    console.log('[TuyenXeList] Updating route with payload:', payload);
    try {
      const result = await updateItem(selectedItem.id, payload);
      console.log('[TuyenXeList] Update success:', result);
      if (result) {
        setShowEditModal(false);
        setSelectedItem(null);
        handleResetSearch();
        alert('Cập nhật tuyến xe thành công!');
      }
    } catch (err) {
      console.error('[TuyenXeList] Update error:', err);
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
        // Search by ID
        console.log('[TuyenXeList] Searching by ID:', keyword);
        try {
          const result = await fetchById(Number(keyword));
          if (result) {
            setSearchResults([result]);
            setSearchError(null);
          } else {
            setSearchResults([]);
            setSearchError(`Không tìm thấy tuyến xe có ID = ${keyword}`);
          }
        } catch (err) {
          console.error('[TuyenXeList] Search by ID error:', err);
          if (err.response?.status === 404 || err.response?.status === 400) {
            setSearchResults([]);
            setSearchError(`Không tìm thấy tuyến xe có ID = ${keyword}`);
          } else {
            setSearchError('Có lỗi xảy ra khi tìm kiếm theo ID');
            setSearchResults([]);
          }
        }
      } else {
        // Search by name
        console.log('[TuyenXeList] Searching by name:', keyword);
        try {
          await searchItems(keyword);
          setSearchResults(null); // Use hook's list
          setSearchError(null);
        } catch (err) {
          console.error('[TuyenXeList] Search by name error:', err);
          setSearchResults([]);
          setSearchError('Không có tuyến xe phù hợp');
        }
      }
    } catch (err) {
      console.error('[TuyenXeList] Search error:', err);
      // Error already handled above
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

  // Determine which list to display
  const displayList = searchResults !== null ? searchResults : list;

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'tentuyenxe', title: 'Tên tuyến xe' },
    { key: 'khoangcach', title: 'Khoảng cách' },
    { key: 'sodiemdung', title: 'Số điểm dừng' },
  ];

  return (
    <div className="page">
      {loading && <Loading fullscreen />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0 }}>Quản lý Tuyến Xe</h1>
        <Button onClick={handleCreate}>Thêm mới</Button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            className="input"
            placeholder="Tìm theo ID hoặc tên tuyến..."
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
              Xóa lọc
            </Button>
          )}
        </form>
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

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Thêm mới Tuyến Xe">
        <TuyenXeForm onSubmit={handleCreateSubmit} onCancel={handleFormClose} />
      </Modal>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Sửa Tuyến Xe">
        {selectedItem && <TuyenXeForm initialData={selectedItem} onSubmit={handleUpdateSubmit} onCancel={handleFormClose} />}
      </Modal>

      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết Tuyến Xe">
        {selectedItem && <TuyenXeDetail data={selectedItem} />}
      </Modal>
    </div>
  );
}

export default TuyenXeList;
