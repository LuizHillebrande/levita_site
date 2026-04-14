import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient() {
  return new PrismaClient()
}

/**
 * Em dev, `globalThis.prisma` pode ter sido criado antes de `prisma generate`
 * adicionar novos models (ex.: ProductReview). A instância antiga não expõe o delegate.
 * Se o client novo já tiver `productReview` e o cache não, substituímos uma vez.
 */
function getClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createClient()
    }
    return globalForPrisma.prisma
  }

  let client = globalForPrisma.prisma
  if (!client) {
    client = createClient()
    globalForPrisma.prisma = client
    return client
  }

  const cached = client as unknown as { productReview?: unknown }
  if (typeof cached.productReview === 'undefined') {
    const fresh = createClient()
    const freshHas = typeof (fresh as unknown as { productReview?: unknown }).productReview !== 'undefined'
    if (freshHas) {
      globalForPrisma.prisma = fresh
      return fresh
    }
  }

  return client
}

export const prisma = getClient()
