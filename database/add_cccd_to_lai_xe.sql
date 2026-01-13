-- ============================================================================
-- Migration: Add CCCD column to lai_xe table
-- ============================================================================
-- This script adds the CCCD (Căn cước công dân) column to the lai_xe table
-- with a UNIQUE constraint to ensure each driver has a unique CCCD.

-- Add CCCD column
ALTER TABLE lai_xe 
ADD COLUMN cccd VARCHAR(12) NOT NULL AFTER hesoluong;

-- Add UNIQUE constraint
ALTER TABLE lai_xe 
ADD CONSTRAINT uk_lai_xe_cccd UNIQUE (cccd);

-- Add index for performance
CREATE INDEX idx_cccd ON lai_xe(cccd);
