-- Migration script to add UNIQUE constraint for doanh_thu table
-- This prevents duplicate revenue entries for the same phan_cong_id and ngaylai

-- Step 1: Remove any existing duplicates (keep the first one)
-- DELETE dt1 FROM doanh_thu dt1
-- INNER JOIN doanh_thu dt2 
-- WHERE dt1.id > dt2.id 
-- AND dt1.phan_cong_id = dt2.phan_cong_id 
-- AND dt1.ngaylai = dt2.ngaylai;

-- Step 2: Add UNIQUE constraint
ALTER TABLE doanh_thu
ADD UNIQUE KEY uk_doanh_thu_phan_cong_ngay (phan_cong_id, ngaylai);

-- Step 3: Update columns to NOT NULL if needed
ALTER TABLE doanh_thu
MODIFY COLUMN ngaylai DATE NOT NULL,
MODIFY COLUMN tiennhienlieu DECIMAL(12, 2) NOT NULL,
MODIFY COLUMN luong DECIMAL(12, 2) NOT NULL,
MODIFY COLUMN tongtienve DECIMAL(12, 2) NOT NULL,
MODIFY COLUMN doanhthu DECIMAL(12, 2) NOT NULL;
