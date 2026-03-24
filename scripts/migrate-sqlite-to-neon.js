/* 
  Data migration: SQLite -> Neon (Postgres)
  - Reads from prisma/dev.db (SQLite)
  - Writes to DATABASE_URL (Neon/Postgres)
  - Upserts by id to avoid duplicates
*/
const { PrismaClient } = require('@prisma/client')

// Source (SQLite) and Target (Postgres/Neon) clients
const sqlite = new PrismaClient({
	datasources: {
		db: {
			// Adjust if your SQLite file path differs
			url: 'file:./prisma/dev.db',
		},
	},
})

const pg = new PrismaClient()

async function upsertMany(modelName, items, upsertFn) {
	if (!items || items.length === 0) {
		console.log(`- ${modelName}: nothing to migrate`)
		return
	}
	let ok = 0
	for (const item of items) {
		await upsertFn(item)
		ok += 1
	}
	console.log(`- ${modelName}: migrated ${ok} item(s)`)
}

async function main() {
	console.log('Starting data migration: SQLite -> Neon (Postgres)')

	// Read from SQLite
	console.log('Reading data from SQLite...')
	const [
		users,
		categories,
		products,
		productImages,
		productOptionals,
		pages,
		contacts,
		certifications,
	] = await Promise.all([
		sqlite.user.findMany(),
		sqlite.category.findMany(),
		sqlite.product.findMany(),
		sqlite.productImage.findMany(),
		sqlite.productOptional.findMany(),
		sqlite.page.findMany(),
		sqlite.contact.findMany(),
		sqlite.certification.findMany(),
	])

	// Write to Postgres/Neon
	console.log('Upserting data into Neon (Postgres)...')

	// Order matters due to FKs:
	// 1) categories
	await upsertMany('Category', categories, (row) =>
		pg.category.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				slug: row.slug,
				description: row.description,
				image: row.image,
				order: row.order,
				updatedAt: row.updatedAt,
			},
			create: {
				id: row.id,
				name: row.name,
				slug: row.slug,
				description: row.description,
				image: row.image,
				order: row.order,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			},
		})
	)

	// 2) products
	await upsertMany('Product', products, (row) =>
		pg.product.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				slug: row.slug,
				description: row.description,
				shortDescription: row.shortDescription,
				price: row.price,
				featured: row.featured,
				active: row.active,
				categoryId: row.categoryId,
				specifications: row.specifications,
				documentation: row.documentation,
				technicalSpecs: row.technicalSpecs,
				updatedAt: row.updatedAt,
			},
			create: {
				id: row.id,
				name: row.name,
				slug: row.slug,
				description: row.description,
				shortDescription: row.shortDescription,
				price: row.price,
				featured: row.featured,
				active: row.active,
				categoryId: row.categoryId,
				specifications: row.specifications,
				documentation: row.documentation,
				technicalSpecs: row.technicalSpecs,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			},
		})
	)

	// 3) product images
	await upsertMany('ProductImage', productImages, (row) =>
		pg.productImage.upsert({
			where: { id: row.id },
			update: {
				url: row.url,
				alt: row.alt,
				order: row.order,
				productId: row.productId,
			},
			create: {
				id: row.id,
				url: row.url,
				alt: row.alt,
				order: row.order,
				productId: row.productId,
				createdAt: row.createdAt,
			},
		})
	)

	// 4) product optionals
	await upsertMany('ProductOptional', productOptionals, (row) =>
		pg.productOptional.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				description: row.description,
				price: row.price,
				showPrice: row.showPrice,
				active: row.active,
				order: row.order,
				productId: row.productId,
				updatedAt: row.updatedAt,
			},
			create: {
				id: row.id,
				name: row.name,
				description: row.description,
				price: row.price,
				showPrice: row.showPrice,
				active: row.active,
				order: row.order,
				productId: row.productId,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			},
		})
	)

	// 5) pages
	await upsertMany('Page', pages, (row) =>
		pg.page.upsert({
			where: { id: row.id },
			update: {
				slug: row.slug,
				title: row.title,
				content: row.content,
				metaTitle: row.metaTitle,
				metaDescription: row.metaDescription,
				active: row.active,
				updatedAt: row.updatedAt,
			},
			create: {
				id: row.id,
				slug: row.slug,
				title: row.title,
				content: row.content,
				metaTitle: row.metaTitle,
				metaDescription: row.metaDescription,
				active: row.active,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			},
		})
	)

	// 6) contacts
	await upsertMany('Contact', contacts, (row) =>
		pg.contact.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				email: row.email,
				phone: row.phone,
				subject: row.subject,
				message: row.message,
				productId: row.productId,
				read: row.read,
			},
			create: {
				id: row.id,
				name: row.name,
				email: row.email,
				phone: row.phone,
				subject: row.subject,
				message: row.message,
				productId: row.productId,
				read: row.read,
				createdAt: row.createdAt,
			},
		})
	)

	// 7) users
	await upsertMany('User', users, (row) =>
		pg.user.upsert({
			where: { id: row.id },
			update: {
				email: row.email,
				password: row.password,
				name: row.name,
				role: row.role,
				updatedAt: row.updatedAt,
			},
			create: {
				id: row.id,
				email: row.email,
				password: row.password,
				name: row.name,
				role: row.role,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			},
		})
	)

	// 8) certifications
	await upsertMany('Certification', certifications, (row) =>
		pg.certification.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				description: row.description,
				image: row.image,
				order: row.order,
				active: row.active,
				updatedAt: row.updatedAt,
			},
			create: {
				id: row.id,
				name: row.name,
				description: row.description,
				image: row.image,
				order: row.order,
				active: row.active,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			},
		})
	)

	console.log('Migration complete.')
}

main()
	.catch((e) => {
		console.error('Migration failed:', e)
		process.exitCode = 1
	})
	.finally(async () => {
		await sqlite.$disconnect()
		await pg.$disconnect()
	})

