import Fluent
import FluentPostgresDriver
import FluentSQLiteDriver
import Leaf
import NIOSSL
import Redis
import Vapor

public func configure(_ app: Application) async throws {
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    if let databaseURL = Environment.get("DATABASE_URL") {
        var tlsConfig = TLSConfiguration.makeClientConfiguration()
        tlsConfig.certificateVerification = .none
        let nioSSLContext = try NIOSSLContext(configuration: tlsConfig)

        var postgresConfig = try SQLPostgresConfiguration(url: databaseURL)
        postgresConfig.coreConfiguration.tls = .prefer(nioSSLContext)
        app.databases.use(.postgres(configuration: postgresConfig), as: .psql)
    } else {
        app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)
    }

    if let redisURL = Environment.get("REDIS_URL") {
        app.redis.configuration = try RedisConfiguration(url: redisURL)
    } else {
        app.redis.configuration = try RedisConfiguration(
            hostname: Environment.get("REDIS_HOST") ?? "localhost",
            port: 6379
        )
    }

    app.migrations.add(CreateCategory())
    app.migrations.add(CreateSupplier())
    app.migrations.add(CreateProduct())
    app.migrations.add(SeedData())

    try await app.autoMigrate()

    app.views.use(.leaf)

    try routes(app)
}
