-- ============================================================================
-- Migration: Update trinhdo ENUM from Cap_1/Cap_2/Cap_3/Dac_Biet to D1/D2/D/E
-- Date: 2024
-- IMPORTANT: Run this script when database already has data
-- ============================================================================

USE bus_driver_db;

-- Step 1: Convert ENUM to VARCHAR temporarily to allow value updates
ALTER TABLE lai_xe 
MODIFY COLUMN trinhdo VARCHAR(20) DEFAULT 'D1';

-- Step 2: Map existing data to new values
-- Cap_1 -> D1
-- Cap_2 -> D2
-- Cap_3 -> D
-- Dac_Biet -> E
-- Default to D1 if value doesn't match any mapping

UPDATE lai_xe SET trinhdo = 'D1' WHERE trinhdo = 'Cap_1';
UPDATE lai_xe SET trinhdo = 'D2' WHERE trinhdo = 'Cap_2';
UPDATE lai_xe SET trinhdo = 'D' WHERE trinhdo = 'Cap_3';
UPDATE lai_xe SET trinhdo = 'E' WHERE trinhdo = 'Dac_Biet';

-- Set default to D1 for any unmapped values (if any)
UPDATE lai_xe SET trinhdo = 'D1' 
WHERE trinhdo NOT IN ('D1', 'D2', 'D', 'E');

-- Step 3: Convert back to ENUM with new values
ALTER TABLE lai_xe 
MODIFY COLUMN trinhdo ENUM('D1', 'D2', 'D', 'E') DEFAULT 'D1' 
COMMENT 'Updated to new enum values: D1, D2, D, E';
