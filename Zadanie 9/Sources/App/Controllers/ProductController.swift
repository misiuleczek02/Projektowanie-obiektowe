import Fluent
import Vapor
import Redis

struct ProductController: RouteCollection {

    private let cacheKey: RedisKey = "products:all"

    func boot(routes: RoutesBuilder) throws {
        let products = routes.grouped("products")
        products.get(use: index)
        products.get("create", use: createForm)
        products.post(use: create)
        products.get(":id", use: show)
        products.get(":id", "edit", use: editForm)
        products.post(":id", "update", use: update)
        products.post(":id", "delete", use: delete)
    }

    struct ProductInput: Content {
        var name: String
        var price: Double
        var quantity: Int
        var categoryID: UUID
        var supplierID: String?
    }

    @Sendable
    func index(req: Request) async throws -> View {
        var items: [ProductDTO]
        var fromCache = false

        if let resp = try? await req.redis.get(cacheKey).get(),
           let json = resp.string,
           let data = json.data(using: .utf8),
           let cached = try? JSONDecoder().decode([ProductDTO].self, from: data) {
            items = cached
            fromCache = true
            req.logger.info("Produkty pobrane z cache Redis")
        } else {
            let products = try await Product.query(on: req.db)
                .with(\.$category)
                .with(\.$supplier)
                .sort(\.$name)
                .all()
            items = try products.map { try ProductDTO(from: $0) }

            if let data = try? JSONEncoder().encode(items),
               let json = String(data: data, encoding: .utf8) {
                _ = try? await req.redis.set(cacheKey, to: json).get()
                _ = try? await req.redis.expire(cacheKey, after: .seconds(60)).get()
            }
            req.logger.info("Produkty pobrane z bazy i zapisane w Redis")
        }

        let context = ProductsListContext(title: "Produkty", products: items, fromCache: fromCache)
        return try await req.view.render("products/index", context)
    }

    @Sendable
    func show(req: Request) async throws -> View {
        let product = try await loadProduct(req)
        let context = ProductDetailContext(title: "Produkt: \(product.name)", product: try ProductDTO(from: product))
        return try await req.view.render("products/show", context)
    }

    @Sendable
    func createForm(req: Request) async throws -> View {
        let context = ProductFormContext(
            title: "Nowy produkt",
            editing: false,
            product: nil,
            categories: try await categoryOptions(req),
            suppliers: try await supplierOptions(req)
        )
        return try await req.view.render("products/form", context)
    }

    @Sendable
    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(ProductInput.self)
        let product = Product(
            name: input.name,
            price: input.price,
            quantity: input.quantity,
            categoryID: input.categoryID,
            supplierID: parseSupplierID(input.supplierID)
        )
        try await product.create(on: req.db)
        try await invalidateCache(req)
        return req.redirect(to: "/products")
    }

    @Sendable
    func editForm(req: Request) async throws -> View {
        let product = try await loadProduct(req)
        let context = ProductFormContext(
            title: "Edycja produktu",
            editing: true,
            product: try ProductDTO(from: product),
            categories: try await categoryOptions(req),
            suppliers: try await supplierOptions(req)
        )
        return try await req.view.render("products/form", context)
    }

    @Sendable
    func update(req: Request) async throws -> Response {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let product = try await Product.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        let input = try req.content.decode(ProductInput.self)
        product.name = input.name
        product.price = input.price
        product.quantity = input.quantity
        product.$category.id = input.categoryID
        product.$supplier.id = parseSupplierID(input.supplierID)
        try await product.update(on: req.db)
        try await invalidateCache(req)
        return req.redirect(to: "/products")
    }

    @Sendable
    func delete(req: Request) async throws -> Response {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let product = try await Product.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        try await product.delete(on: req.db)
        try await invalidateCache(req)
        return req.redirect(to: "/products")
    }

    private func loadProduct(_ req: Request) async throws -> Product {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let product = try await Product.query(on: req.db)
            .filter(\.$id == id)
            .with(\.$category)
            .with(\.$supplier)
            .first()
        else {
            throw Abort(.notFound)
        }
        return product
    }

    private func parseSupplierID(_ raw: String?) -> UUID? {
        guard let raw, !raw.isEmpty else { return nil }
        return UUID(uuidString: raw)
    }

    private func categoryOptions(_ req: Request) async throws -> [CategoryOption] {
        try await Category.query(on: req.db).sort(\.$name).all()
            .map { try CategoryOption(id: $0.requireID(), name: $0.name) }
    }

    private func supplierOptions(_ req: Request) async throws -> [SupplierOption] {
        try await Supplier.query(on: req.db).sort(\.$name).all()
            .map { try SupplierOption(id: $0.requireID(), name: $0.name) }
    }

    private func invalidateCache(_ req: Request) async throws {
        _ = try? await req.redis.delete(cacheKey).get()
        req.logger.info("Cache Redis produktow uniewazniony")
    }
}
