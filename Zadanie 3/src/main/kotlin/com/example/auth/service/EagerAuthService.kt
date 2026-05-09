package com.example.auth.service

import com.example.auth.model.UserDto
import org.springframework.context.annotation.Primary
import org.springframework.stereotype.Service

@Primary
@Service
class EagerAuthService : AuthService {
    private val users = listOf(
        UserDto(id = 1, username = "alice", role = "USER"),
        UserDto(id = 2, username = "bob", role = "ADMIN"),
        UserDto(id = 3, username = "carol", role = "USER")
    )

    override fun authenticate(username: String, password: String): Boolean {
        return users.any { it.username == username && password == "password" }
    }

    override fun getUsers(): List<UserDto> = users
}
