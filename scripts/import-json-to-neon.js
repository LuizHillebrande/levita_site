/* 
  Import JSON exports (from SQLite) into Neon (Postgres) using Prisma
  Expects files in tmp/export/*.json created by sqlite3 -json
*/
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const pg = new PrismaClient()
const base = path.join(process.cwd(), 'tmp', 'export')

function readJson(filename) {
	const full = path.join(base, filename)
	if (!fs.existsSync(full)) return []
	const raw = fs.readFileSync(full, 'utf8').trim()
	if (!raw) return []
	try {
		return JSON.parse(raw)
	} catch (e) {
		console.error(`Failed to parse ${filename}:`, e)
		return []
	}
}

async function upsertMany(modelName, items, upsertFn) {
	if (!items || items.length === 0) {
		console.log(`- ${modelName}: nothing to import`)
		return
	}
	let ok = 0
	for (const item of items) {
		await upsertFn(item)
		ok += 1
	}
	console.log(`- ${modelName}: imported ${ok} item(s)`)
}

async function main() {
	console.log('Importing JSON into Neon (Postgres)')

	const users = readJson('user.json')
	const categories = readJson('category.json')
	const products = readJson('product.json')
	const productImages = readJson('productImage.json')
	const productOptionals = readJson('productOptional.json')
	const pages = readJson('page.json')
	const contacts = readJson('contact.json')
	const certifications = readJson('certification.json')

	// Order to satisfy FKs
	await upsertMany('Category', categories, (row) =>
		pg.category.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				slug: row.slug,
				description: row.description ?? null,
				image: row.image ?? null,
				order: row.order ?? 0,
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
			create: {
				id: row.id,
				name: row.name,
				slug: row.slug,
				description: row.description ?? null,
				image: row.image ?? null,
				order: row.order ?? 0,
				createdAt: new Date(row.createdAt ?? Date.now()),
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
		})
	)

	await upsertMany('Product', products, (row) =>
		pg.product.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				slug: row.slug,
				description: row.description ?? null,
				shortDescription: row.shortDescription ?? null,
				price: row.price ?? null,
				featured: !!row.featured,
				active: !!row.active,
				categoryId: row.categoryId ?? null,
				specifications: row.specifications ?? null,
				documentation: row.documentation ?? null,
				technicalSpecs: row.technicalSpecs ?? null,
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
			create: {
				id: row.id,
				name: row.name,
				slug: row.slug,
				description: row.description ?? null,
				shortDescription: row.shortDescription ?? null,
				price: row.price ?? null,
				featured: !!row.featured,
				active: !!row.active,
				categoryId: row.categoryId ?? null,
				specifications: row.specifications ?? null,
				documentation: row.documentation ?? null,
				technicalSpecs: row.technicalSpecs ?? null,
				createdAt: new Date(row.createdAt ?? Date.now()),
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
		})
	)

	await upsertMany('ProductImage', productImages, (row) =>
		pg.productImage.upsert({
			where: { id: row.id },
			update: {
				url: row.url,
				alt: row.alt ?? null,
				order: row.order ?? 0,
				productId: row.productId,
			},
			create: {
				id: row.id,
				url: row.url,
				alt: row.alt ?? null,
				order: row.order ?? 0,
				productId: row.productId,
				createdAt: new Date(row.createdAt ?? Date.now()),
			},
		})
	)

	await upsertMany('ProductOptional', productOptionals, (row) =>
		pg.productOptional.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				description: row.description ?? null,
				price: row.price ?? null,
				showPrice: !!row.showPrice,
				active: !!row.active,
				order: row.order ?? 0,
				productId: row.productId,
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
			create: {
				id: row.id,
				name: row.name,
				description: row.description ?? null,
				price: row.price ?? null,
				showPrice: !!row.showPrice,
				active: !!row.active,
				order: row.order ?? 0,
				productId: row.productId,
				createdAt: new Date(row.createdAt ?? Date.now()),
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
		})
	)

	await upsertMany('Page', pages, (row) =>
		pg.page.upsert({
			where: { id: row.id },
			update: {
				slug: row.slug,
				title: row.title,
				content: row.content,
				metaTitle: row.metaTitle ?? null,
				metaDescription: row.metaDescription ?? null,
				active: !!row.active,
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
			create: {
				id: row.id,
				slug: row.slug,
				title: row.title,
				content: row.content,
				metaTitle: row.metaTitle ?? null,
				metaDescription: row.metaDescription ?? null,
				active: !!row.active,
				createdAt: new Date(row.createdAt ?? Date.now()),
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
		})
	)

	await upsertMany('Contact', contacts, (row) =>
		pg.contact.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				email: row.email,
				phone: row.phone ?? null,
				subject: row.subject ?? null,
				message: row.message,
				productId: row.productId ?? null,
				read: !!row.read,
			},
			create: {
				id: row.id,
				name: row.name,
				email: row.email,
				phone: row.phone ?? null,
				subject: row.subject ?? null,
				message: row.message,
				productId: row.productId ?? null,
				read: !!row.read,
				createdAt: new Date(row.createdAt ?? Date.now()),
			},
		})
	)

	await upsertMany('User', users, (row) =>
		pg.user.upsert({
			where: { id: row.id },
			update: {
				email: row.email,
				password: row.password,
				name: row.name,
				role: row.role,
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
			create: {
				id: row.id,
				email: row.email,
				password: row.password,
				name: row.name,
				role: row.role,
				createdAt: new Date(row.createdAt ?? Date.now()),
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
		})
	)

	await upsertMany('Certification', certifications, (row) =>
		pg.certification.upsert({
			where: { id: row.id },
			update: {
				name: row.name,
				description: row.description ?? null,
				image: row.image ?? null,
				order: row.order ?? 0,
				active: !!row.active,
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
			create: {
				id: row.id,
				name: row.name,
				description: row.description ?? null,
				image: row.image ?? null,
				order: row.order ?? 0,
				active: !!row.active,
				createdAt: new Date(row.createdAt ?? Date.now()),
				updatedAt: new Date(row.updatedAt ?? Date.now()),
			},
		})
	)

	console.log('Import finished.')
}

main()
	.catch((e) => {
		console.error('Import failed:', e)
		process.exitCode = 1
	})
	.finally(async () => {
		await pg.$disconnect()
	})

