package com.example.auth.model

data class AuthRequest(
    val username: String,
    val password: String
) {
    init {
        require(username.isNotBlank()) { "Username cannot be blank" }
        require(username.length >= 3) { "Username must be at least 3 characters long" }
        require(password.isNotBlank()) { "Password cannot be blank" }
        require(password.length >= 6) { "Password must be at least 6 characters long" }
    }
}
