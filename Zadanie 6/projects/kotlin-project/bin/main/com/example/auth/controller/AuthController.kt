package com.example.auth.controller

import com.example.auth.model.AuthRequest
import com.example.auth.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class AuthController(private val authService: AuthService) {

    @GetMapping("/users")
    fun getUsers() = authService.getUsers()

    @PostMapping("/auth")
    fun authenticate(@RequestBody request: AuthRequest): ResponseEntity<Map<String, Any>> {
        val authenticated = authService.authenticate(request.username, request.password)
        val body = mapOf(
            "username" to request.username,
            "authenticated" to authenticated,
            "message" to if (authenticated) "Authenticated successfully" else "Invalid username or password"
        )

        return if (authenticated) {
            ResponseEntity.ok(body)
        } else {
            ResponseEntity.status(401).body(body)
        }
    }
}
