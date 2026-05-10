package com.example.auth.service

import com.example.auth.model.UserDto
import org.springframework.context.annotation.Primary
import org.springframework.stereotype.Service
import java.security.MessageDigest

@Primary
@Service
class EagerAuthService : AuthService {

    private val users = listOf(
        UserDto(id = 1, username = "alice", role = "USER"),
        UserDto(id = 2, username = "bob", role = "ADMIN"),
        UserDto(id = 3, username = "carol", role = "USER")
    )

    // Simple hash for demo - in production use BCrypt
    private fun hashPassword(password: String): String {
        return MessageDigest.getInstance("SHA-256")
            .digest(password.toByteArray())
            .joinToString("") { "%02x".format(it) }
    }

    override fun authenticate(username: String, password: String): Boolean {
        val hashedPassword = hashPassword(password)
        val expectedHash = hashPassword("password") // In production, store hashed passwords in DB
        return users.any { it.username == username } && hashedPassword == expectedHash
    }

    override fun getUsers(): List<UserDto> = users
}
