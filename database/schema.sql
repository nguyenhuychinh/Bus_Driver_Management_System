-- ============================================================================
-- Bus Driver Management System - MySQL 8 Schema
-- Database: bus_driver_db
-- Updated to match backend entity column names exactly
-- ============================================================================

CREATE DATABASE IF NOT EXISTS bus_driver_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bus_driver_db;

-- ============================================================================
-- UserInfo Table - User authentication and profile
-- Column names match UserInfo entity @Column annotations exactly:
-- - fullname -> full_name (changed to match @Column(name = "full_name"))
-- - pass -> password (changed to match @Column(name = "password"))
-- - Added role column (matches @Column(name = "role"))
-- ============================================================================
CREATE TABLE user_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL COMMENT 'Changed from fullname to match backend entity',
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL COMMENT 'Changed from pass to match backend entity. Hashed password',
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(255) DEFAULT 'USER' COMMENT 'Added to match backend entity',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- LaiXe Table - Driver information
-- Column names use lowercase (no underscores) to match @Column annotations:
-- @Column(name = "hoten"), @Column(name = "diachi"), etc.
-- ============================================================================
CREATE TABLE lai_xe (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hoten VARCHAR(255) NOT NULL COMMENT 'Changed from ho_ten to match @Column(name = "hoten")',
  diachi VARCHAR(500) COMMENT 'Changed from dia_chi to match @Column(name = "diachi")',
  trinhdo ENUM('D1', 'D2', 'D', 'E') DEFAULT 'D1' COMMENT 'Changed from trinh_do to match @Column(name = "trinhdo")',
  sodienthoai VARCHAR(20) COMMENT 'Changed from so_dien_thoai to match @Column(name = "sodienthoai")',
  hesoluong DECIMAL(5, 2) DEFAULT 1.00 COMMENT 'Changed from he_so_luong to match @Column(name = "hesoluong")',
  cccd VARCHAR(12) NOT NULL COMMENT 'Căn cước công dân - UNIQUE',
  tongsotuyenlai INT DEFAULT 0 COMMENT 'Changed from tong_so_tuyen_lai to match @Column(name = "tongsotuyenlai")',
  luongphaitra DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Changed from luong_phai_tra to match @Column(name = "luongphaitra")',
  luongdatra DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Changed from luong_da_tra to match @Column(name = "luongdatra")',
  luongconno DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Changed from luong_con_no to match @Column(name = "luongconno")',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_hoten (hoten),
  INDEX idx_sodienthoai (sodienthoai),
  INDEX idx_trinhdo (trinhdo),
  UNIQUE KEY uk_lai_xe_cccd (cccd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TuyenXe Table - Bus route information
-- Column names use lowercase (no underscores) to match @Column annotations:
-- @Column(name = "tentuyenxe"), @Column(name = "khoangcach"), etc.
-- ============================================================================
CREATE TABLE tuyen_xe (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tentuyenxe VARCHAR(255) NOT NULL COMMENT 'Changed from ten_tuyen_xe to match @Column(name = "tentuyenxe")',
  khoangcach DECIMAL(10, 2) COMMENT 'Changed from khoang_cach to match @Column(name = "khoangcach")',
  sodiemdung INT COMMENT 'Changed from so_diem_dung to match @Column(name = "sodiemdung")',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_tentuyenxe (tentuyenxe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PhanCong Table - Driver assignment to routes
-- Foreign key columns use snake_case: laixe_id, tuyen_xe_id (from @JoinColumn)
-- Regular columns use lowercase: ngay, soluotchay, nhienlieu (from @Column)
-- ============================================================================
CREATE TABLE phan_cong (
  id INT AUTO_INCREMENT PRIMARY KEY,
  laixe_id INT NOT NULL COMMENT 'Matches @JoinColumn(name = "laixe_id")',
  tuyen_xe_id INT NOT NULL COMMENT 'Matches @JoinColumn(name = "tuyen_xe_id")',
  ngay DATE NOT NULL COMMENT 'Matches @Column(name = "ngay")',
  soluotchay INT DEFAULT 0 COMMENT 'Changed from so_luot_chay to match @Column(name = "soluotchay")',
  nhienlieu DECIMAL(10, 2) COMMENT 'Changed from nhien_lieu to match @Column(name = "nhienlieu")',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_phan_cong_lai_xe FOREIGN KEY (laixe_id) 
    REFERENCES lai_xe(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_phan_cong_tuyen_xe FOREIGN KEY (tuyen_xe_id) 
    REFERENCES tuyen_xe(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  
  INDEX idx_laixe_id (laixe_id),
  INDEX idx_tuyen_xe_id (tuyen_xe_id),
  INDEX idx_ngay (ngay),
  UNIQUE KEY uk_phan_cong (laixe_id, tuyen_xe_id, ngay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DoanhThu Table - Revenue information
-- Foreign key: phan_cong_id (from @JoinColumn)
-- Regular columns use lowercase: ngaylai, nhienlieu, etc. (from @Column)
-- ============================================================================
CREATE TABLE doanh_thu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phan_cong_id INT NOT NULL COMMENT 'Matches @JoinColumn(name = "phan_cong_id")',
  ngaylai DATE NOT NULL COMMENT 'Changed from ngay_lai to match @Column(name = "ngaylai")',
  nhienlieu DECIMAL(10, 2) COMMENT 'Changed from nhien_lieu to match @Column(name = "nhienlieu")',
  tiennhienlieu DECIMAL(12, 2) NOT NULL COMMENT 'Changed from tien_nhien_lieu to match @Column(name = "tiennhienlieu") - Tự tính từ phan_cong.nhienlieu * 23000 nếu không có input',
  luong DECIMAL(12, 2) NOT NULL COMMENT 'Matches @Column(name = "luong") - Tự tính từ phan_cong.soluotchay * 100000 * lai_xe.hesoluong',
  sohanhkhach INT COMMENT 'Changed from so_hanh_khach to match @Column(name = "sohanhkhach") - NULLABLE, không bắt buộc',
  tongtienve DECIMAL(12, 2) NOT NULL COMMENT 'Changed from tong_tien_ve to match @Column(name = "tongtienve")',
  doanhthu DECIMAL(12, 2) NOT NULL COMMENT 'Matches @Column(name = "doanhthu") - Tự tính = tongtienve - (luong + tiennhienlieu)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_doanh_thu_phan_cong FOREIGN KEY (phan_cong_id) 
    REFERENCES phan_cong(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  UNIQUE KEY uk_doanh_thu_phan_cong_ngay (phan_cong_id, ngaylai) COMMENT 'Tránh trùng doanh thu cho cùng 1 phân công/ngày',
  
  INDEX idx_phan_cong_id (phan_cong_id),
  INDEX idx_ngaylai (ngaylai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- End of schema definition
-- ============================================================================
