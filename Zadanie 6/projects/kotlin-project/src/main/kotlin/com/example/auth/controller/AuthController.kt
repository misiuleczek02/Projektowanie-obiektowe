package com.example.auth.controller

import com.example.auth.model.AuthRequest
import com.example.auth.service.AuthService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class AuthController(private val authService: AuthService) {

    private val logger = LoggerFactory.getLogger(AuthController::class.java)

    @GetMapping("/users")
    fun getUsers() = authService.getUsers()

    @PostMapping("/auth")
    fun authenticate(@RequestBody request: AuthRequest): ResponseEntity<Map<String, Any>> {
        logger.info("Authentication attempt for user: {}", request.username)

        return try {
            val authenticated = authService.authenticate(request.username, request.password)
            val body = mapOf(
                "username" to request.username,
                "authenticated" to authenticated,
                "message" to if (authenticated) "Authenticated successfully" else "Invalid username or password"
            )

            if (authenticated) {
                logger.info("User {} authenticated successfully", request.username)
                ResponseEntity.ok(body)
            } else {
                logger.warn("Failed authentication attempt for user: {}", request.username)
                ResponseEntity.status(401).body(body)
            }
        } catch (e: Exception) {
            logger.error("Authentication error for user {}: {}", request.username, e.message)
            ResponseEntity.status(500).body(mapOf("error" to "Internal server error"))
        }
    }
}
