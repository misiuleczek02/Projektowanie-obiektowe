import Fluent
import Vapor

final class Product: Model, Content, @unchecked Sendable {
    static let schema = "products"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Field(key: "price")
    var price: Double

    @Field(key: "quantity")
    var quantity: Int

    @Parent(key: "category_id")
    var category: Category

    @OptionalParent(key: "supplier_id")
    var supplier: Supplier?

    init() {}

    init(
        id: UUID? = nil,
        name: String,
        price: Double,
        quantity: Int,
        categoryID: UUID,
        supplierID: UUID? = nil
    ) {
        self.id = id
        self.name = name
        self.price = price
        self.quantity = quantity
        self.$category.id = categoryID
        self.$supplier.id = supplierID
    }
}
