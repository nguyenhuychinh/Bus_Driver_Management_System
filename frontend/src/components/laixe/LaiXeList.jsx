import { useEffect, useState } from 'react';
import useLaiXe from '../../hooks/useLaiXe';
import Modal from '../common/Modal';
import Table from '../common/Table';
import Button from '../common/Button';
import Loading from '../common/Loading';
import LaiXeForm from './LaiXeForm';
import LaiXeDetail from './LaiXeDetail';

function LaiXeList() {
  const { list, loading, error, fetchAll, createItem, updateItem, removeItem, fetchById } = useLaiXe();
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
        alert('Xóa lái xe thành công!');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa';
        alert(errorMessage);
      }
    }
  };

  const handleCreateSubmit = async (payload) => {
    console.log('[LaiXeList] Creating new driver with payload:', payload);
    try {
      const result = await createItem(payload);
      console.log('[LaiXeList] Create success:', result);
      if (result) {
        setShowCreateModal(false);
        handleResetSearch();
        alert('Thêm lái xe thành công!');
      }
    } catch (err) {
      console.error('[LaiXeList] Create error:', err);
      throw err;
    }
  };

  const handleUpdateSubmit = async (payload) => {
    console.log('[LaiXeList] Updating driver with payload:', payload);
    try {
      const result = await updateItem(selectedItem.id, payload);
      console.log('[LaiXeList] Update success:', result);
      if (result) {
        setShowEditModal(false);
        setSelectedItem(null);
        handleResetSearch();
        alert('Cập nhật lái xe thành công!');
      }
    } catch (err) {
      console.error('[LaiXeList] Update error:', err);
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
        console.log('[LaiXeList] Searching by ID:', keyword);
        try {
          const result = await fetchById(Number(keyword));
          if (result) {
            setSearchResults([result]);
            setSearchError(null);
          } else {
            setSearchResults([]);
            setSearchError(`Không tìm thấy lái xe có mã = ${keyword}`);
          }
        } catch (err) {
          console.error('[LaiXeList] Search by ID error:', err);
          if (err.response?.status === 404 || err.response?.status === 400) {
            setSearchResults([]);
            setSearchError(`Không tìm thấy lái xe có mã = ${keyword}`);
          } else {
            setSearchError('Có lỗi xảy ra khi tìm kiếm theo mã');
            setSearchResults([]);
          }
        }
      } else {
        // Search by name - filter local list
        console.log('[LaiXeList] Searching by name:', keyword);
        const filtered = list.filter((item) => 
          item.hoten?.toLowerCase().includes(keyword.toLowerCase())
        );
        if (filtered.length > 0) {
          setSearchResults(filtered);
          setSearchError(null);
        } else {
          setSearchResults([]);
          setSearchError('Không có lái xe phù hợp');
        }
      }
    } catch (err) {
      console.error('[LaiXeList] Search error:', err);
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
    { key: 'hoten', title: 'Họ tên' },
    { key: 'trinhdo', title: 'Trình độ' },
    { key: 'sodienthoai', title: 'Số điện thoại' },
    { key: 'hesoluong', title: 'Hệ số lương' },
  ];

  return (
    <div className="page">
      {loading && <Loading fullscreen />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0 }}>Quản lý Lái Xe</h1>
        <Button onClick={handleCreate}>Thêm mới</Button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            className="input"
            placeholder="Nhập mã lái xe hoặc tên..."
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

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Thêm mới Lái Xe">
        <LaiXeForm onSubmit={handleCreateSubmit} onCancel={handleFormClose} />
      </Modal>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Sửa Lái Xe">
        {selectedItem && <LaiXeForm initialData={selectedItem} onSubmit={handleUpdateSubmit} onCancel={handleFormClose} />}
      </Modal>

      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết Lái Xe">
        {selectedItem && <LaiXeDetail data={selectedItem} />}
      </Modal>
    </div>
  );
}

export default LaiXeList;
