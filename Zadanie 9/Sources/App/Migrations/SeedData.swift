import Fluent

struct SeedData: AsyncMigration {
    func prepare(on database: Database) async throws {
        let elektronika = Category(name: "Elektronika", description: "Sprzęt elektroniczny i akcesoria")
        let spozywcze = Category(name: "Spożywcze", description: "Artykuły spożywcze")
        try await elektronika.create(on: database)
        try await spozywcze.create(on: database)

        let techSupply = Supplier(name: "TechSupply", email: "kontakt@techsupply.pl", city: "Warszawa")
        let foodDystrybucja = Supplier(name: "Food Dystrybucja", email: "biuro@fooddist.pl", city: "Kraków")
        try await techSupply.create(on: database)
        try await foodDystrybucja.create(on: database)

        try await Product(
            name: "Laptop Pro 15",
            price: 3499.99,
            quantity: 10,
            categoryID: elektronika.requireID(),
            supplierID: techSupply.requireID()
        ).create(on: database)

        try await Product(
            name: "Smartfon X",
            price: 1999.00,
            quantity: 25,
            categoryID: elektronika.requireID(),
            supplierID: techSupply.requireID()
        ).create(on: database)

        try await Product(
            name: "Kawa ziarnista 1kg",
            price: 49.99,
            quantity: 100,
            categoryID: spozywcze.requireID(),
            supplierID: foodDystrybucja.requireID()
        ).create(on: database)
    }

    func revert(on database: Database) async throws {
        try await Product.query(on: database).delete()
        try await Supplier.query(on: database).delete()
        try await Category.query(on: database).delete()
    }
}
