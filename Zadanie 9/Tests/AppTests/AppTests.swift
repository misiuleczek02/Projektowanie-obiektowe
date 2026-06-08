@testable import App
import XCTVapor

final class AppTests: XCTestCase {
    func testHealthRoute() async throws {
        let app = try await Application.make(.testing)
        try await configure(app)
        defer { Task { try? await app.asyncShutdown() } }

        try await app.test(.GET, "health") { res async in
            XCTAssertEqual(res.status, .ok)
            XCTAssertEqual(res.body.string, "OK")
        }
    }
}
