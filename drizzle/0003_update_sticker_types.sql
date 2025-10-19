-- Update stickers table type column to use new enum values
-- First, we need to update any existing data to use the new types
-- Since we're changing from heart/star/thumbs-up to blob-blue/blob-green/etc,
-- we'll map the old values to new ones

UPDATE stickers SET type = 'blob-blue' WHERE type = 'heart';
UPDATE stickers SET type = 'star-sparkle' WHERE type = 'star';
UPDATE stickers SET type = 'blob-green' WHERE type = 'thumbs-up';

-- Note: SQLite doesn't support ALTER COLUMN with enum constraints directly
-- The enum constraint is handled at the application level in Drizzle
