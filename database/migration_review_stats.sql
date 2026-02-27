-- Migration: Add review stats to books
-- Adds avg_rating and review_count to books table for performance

-- 1. Add columns
ALTER TABLE books ADD COLUMN IF NOT EXISTS avg_rating NUMERIC(2,1) DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- 2. Backfill from existing data
UPDATE books SET
  avg_rating = sub.avg_rating,
  review_count = sub.review_count
FROM (
  SELECT book_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS review_count
  FROM reviews GROUP BY book_id
) sub WHERE books.id = sub.book_id;

-- 3. Trigger function to keep stats in sync
CREATE OR REPLACE FUNCTION update_book_review_stats() RETURNS TRIGGER AS $$
BEGIN
  -- We use COALESCE and NEW/OLD to handle all insert/update/delete cases
  UPDATE books SET
    avg_rating = COALESCE((SELECT ROUND(AVG(rating), 1) FROM reviews WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)), 0),
    review_count = COALESCE((SELECT COUNT(*) FROM reviews WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)), 0)
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger
DROP TRIGGER IF EXISTS trg_review_stats ON reviews;
CREATE TRIGGER trg_review_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_book_review_stats();
