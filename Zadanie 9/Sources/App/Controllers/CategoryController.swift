import Fluent
import Vapor

struct CategoryController: RouteCollection {

    func boot(routes: RoutesBuilder) throws {
        let categories = routes.grouped("categories")
        categories.get(use: index)
        categories.get("create", use: createForm)
        categories.post(use: create)
        categories.get(":id", use: show)
        categories.get(":id", "edit", use: editForm)
        categories.post(":id", "update", use: update)
        categories.post(":id", "delete", use: delete)
    }

    struct CategoryInput: Content {
        var name: String
        var description: String
    }

    @Sendable
    func index(req: Request) async throws -> View {
        let categories = try await Category.query(on: req.db)
            .with(\.$products)
            .sort(\.$name)
            .all()
        let dtos = try categories.map { category in
            CategoryDTO(
                id: try category.requireID(),
                name: category.name,
                description: category.description,
                productCount: category.products.count
            )
        }
        return try await req.view.render("categories/index", CategoriesListContext(title: "Kategorie", categories: dtos))
    }

    @Sendable
    func show(req: Request) async throws -> View {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let category = try await Category.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        let productModels = try await category.$products.query(on: req.db)
            .with(\.$category)
            .with(\.$supplier)
            .all()
        let dto = CategoryDTO(
            id: try category.requireID(),
            name: category.name,
            description: category.description,
            productCount: productModels.count
        )
        let products = try productModels.map { try ProductDTO(from: $0) }
        return try await req.view.render("categories/show", CategoryDetailContext(title: "Kategoria: \(category.name)", category: dto, products: products))
    }

    @Sendable
    func createForm(req: Request) async throws -> View {
        try await req.view.render("categories/form", CategoryFormContext(title: "Nowa kategoria", editing: false, category: nil))
    }

    @Sendable
    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(CategoryInput.self)
        let category = Category(name: input.name, description: input.description)
        try await category.create(on: req.db)
        return req.redirect(to: "/categories")
    }

    @Sendable
    func editForm(req: Request) async throws -> View {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let category = try await Category.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        let dto = CategoryDTO(id: try category.requireID(), name: category.name, description: category.description, productCount: 0)
        return try await req.view.render("categories/form", CategoryFormContext(title: "Edycja kategorii", editing: true, category: dto))
    }

    @Sendable
    func update(req: Request) async throws -> Response {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let category = try await Category.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        let input = try req.content.decode(CategoryInput.self)
        category.name = input.name
        category.description = input.description
        try await category.update(on: req.db)
        return req.redirect(to: "/categories")
    }

    @Sendable
    func delete(req: Request) async throws -> Response {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let category = try await Category.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        try await category.delete(on: req.db)
        return req.redirect(to: "/categories")
    }
}
