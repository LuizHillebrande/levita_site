CREATE TABLE IF NOT EXISTS "ProductVideo" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "title" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProductVideo_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ProductVideo_productId_fkey'
  ) THEN
    ALTER TABLE "ProductVideo"
    ADD CONSTRAINT "ProductVideo_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "ProductVideo_productId_idx" ON "ProductVideo"("productId");
