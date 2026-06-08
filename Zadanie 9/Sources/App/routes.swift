import Fluent
import Vapor

func routes(_ app: Application) throws {
    app.get { req async throws -> View in
        try await req.view.render("index", ["title": "Sklep — Vapor"])
    }

    app.get("health") { _ async -> String in
        "OK"
    }

    try app.register(collection: ProductController())
    try app.register(collection: CategoryController())
    try app.register(collection: SupplierController())
}
