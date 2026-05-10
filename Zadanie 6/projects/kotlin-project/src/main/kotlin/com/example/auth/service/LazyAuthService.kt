package com.example.auth.service

import com.example.auth.model.UserDto
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service

@Lazy
@Service
class LazyAuthService : AuthService {
    private val users = listOf(
        UserDto(id = 10, username = "lazyuser", role = "GUEST")
    )

    override fun authenticate(username: String, password: String): Boolean {
        return users.any { it.username == username && password == "lazy" }
    }

    override fun getUsers(): List<UserDto> = users
}
