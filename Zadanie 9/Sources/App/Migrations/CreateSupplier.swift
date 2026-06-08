import Fluent

struct CreateSupplier: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema("suppliers")
            .id()
            .field("name", .string, .required)
            .field("email", .string, .required)
            .field("city", .string, .required)
            .create()
    }

    func revert(on database: Database) async throws {
        try await database.schema("suppliers").delete()
    }
}
