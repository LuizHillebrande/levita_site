-- Optional photo URLs on product reviews. Existing rows keep all data and receive an empty list.
ALTER TABLE "ProductReview" ADD COLUMN "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
