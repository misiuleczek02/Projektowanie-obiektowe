import Fluent
import Vapor

struct SupplierController: RouteCollection {

    func boot(routes: RoutesBuilder) throws {
        let suppliers = routes.grouped("suppliers")
        suppliers.get(use: index)
        suppliers.get("create", use: createForm)
        suppliers.post(use: create)
        suppliers.get(":id", use: show)
        suppliers.get(":id", "edit", use: editForm)
        suppliers.post(":id", "update", use: update)
        suppliers.post(":id", "delete", use: delete)
    }

    struct SupplierInput: Content {
        var name: String
        var email: String
        var city: String
    }

    @Sendable
    func index(req: Request) async throws -> View {
        let suppliers = try await Supplier.query(on: req.db)
            .with(\.$products)
            .sort(\.$name)
            .all()
        let dtos = try suppliers.map { supplier in
            SupplierDTO(
                id: try supplier.requireID(),
                name: supplier.name,
                email: supplier.email,
                city: supplier.city,
                productCount: supplier.products.count
            )
        }
        return try await req.view.render("suppliers/index", SuppliersListContext(title: "Dostawcy", suppliers: dtos))
    }

    @Sendable
    func show(req: Request) async throws -> View {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let supplier = try await Supplier.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        let productModels = try await supplier.$products.query(on: req.db)
            .with(\.$category)
            .with(\.$supplier)
            .all()
        let dto = SupplierDTO(
            id: try supplier.requireID(),
            name: supplier.name,
            email: supplier.email,
            city: supplier.city,
            productCount: productModels.count
        )
        let products = try productModels.map { try ProductDTO(from: $0) }
        return try await req.view.render("suppliers/show", SupplierDetailContext(title: "Dostawca: \(supplier.name)", supplier: dto, products: products))
    }

    @Sendable
    func createForm(req: Request) async throws -> View {
        try await req.view.render("suppliers/form", SupplierFormContext(title: "Nowy dostawca", editing: false, supplier: nil))
    }

    @Sendable
    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(SupplierInput.self)
        let supplier = Supplier(name: input.name, email: input.email, city: input.city)
        try await supplier.create(on: req.db)
        return req.redirect(to: "/suppliers")
    }

    @Sendable
    func editForm(req: Request) async throws -> View {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let supplier = try await Supplier.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        let dto = SupplierDTO(id: try supplier.requireID(), name: supplier.name, email: supplier.email, city: supplier.city, productCount: 0)
        return try await req.view.render("suppliers/form", SupplierFormContext(title: "Edycja dostawcy", editing: true, supplier: dto))
    }

    @Sendable
    func update(req: Request) async throws -> Response {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let supplier = try await Supplier.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        let input = try req.content.decode(SupplierInput.self)
        supplier.name = input.name
        supplier.email = input.email
        supplier.city = input.city
        try await supplier.update(on: req.db)
        return req.redirect(to: "/suppliers")
    }

    @Sendable
    func delete(req: Request) async throws -> Response {
        let id = try req.parameters.require("id", as: UUID.self)
        guard let supplier = try await Supplier.find(id, on: req.db) else {
            throw Abort(.notFound)
        }
        try await supplier.delete(on: req.db)
        return req.redirect(to: "/suppliers")
    }
}
