import Vapor

struct ProductDTO: Content {
    let id: UUID
    let name: String
    let price: Double
    let quantity: Int
    let categoryID: UUID
    let categoryName: String
    let supplierID: UUID?
    let supplierName: String?

    init(from product: Product) throws {
        self.id = try product.requireID()
        self.name = product.name
        self.price = product.price
        self.quantity = product.quantity
        self.categoryID = product.$category.id
        self.categoryName = product.category.name
        self.supplierID = product.$supplier.id
        self.supplierName = product.supplier?.name
    }
}

struct CategoryOption: Content {
    let id: UUID
    let name: String
}

struct SupplierOption: Content {
    let id: UUID
    let name: String
}

struct ProductsListContext: Content {
    let title: String
    let products: [ProductDTO]
    let fromCache: Bool
}

struct ProductDetailContext: Content {
    let title: String
    let product: ProductDTO
}

struct ProductFormContext: Content {
    let title: String
    let editing: Bool
    let product: ProductDTO?
    let categories: [CategoryOption]
    let suppliers: [SupplierOption]
}

struct CategoryDTO: Content {
    let id: UUID
    let name: String
    let description: String
    let productCount: Int
}

struct CategoriesListContext: Content {
    let title: String
    let categories: [CategoryDTO]
}

struct CategoryDetailContext: Content {
    let title: String
    let category: CategoryDTO
    let products: [ProductDTO]
}

struct CategoryFormContext: Content {
    let title: String
    let editing: Bool
    let category: CategoryDTO?
}

struct SupplierDTO: Content {
    let id: UUID
    let name: String
    let email: String
    let city: String
    let productCount: Int
}

struct SuppliersListContext: Content {
    let title: String
    let suppliers: [SupplierDTO]
}

struct SupplierDetailContext: Content {
    let title: String
    let supplier: SupplierDTO
    let products: [ProductDTO]
}

struct SupplierFormContext: Content {
    let title: String
    let editing: Bool
    let supplier: SupplierDTO?
}
