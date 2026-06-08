import Fluent

struct CreateProduct: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema("products")
            .id()
            .field("name", .string, .required)
            .field("price", .double, .required)
            .field("quantity", .int, .required)
            .field("category_id", .uuid, .required, .references("categories", "id", onDelete: .cascade))
            .field("supplier_id", .uuid, .references("suppliers", "id", onDelete: .setNull))
            .create()
    }

    func revert(on database: Database) async throws {
        try await database.schema("products").delete()
    }
}
