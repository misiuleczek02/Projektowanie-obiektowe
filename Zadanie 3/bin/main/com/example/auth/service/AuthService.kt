package com.example.auth.service

import com.example.auth.model.UserDto

interface AuthService {
    fun authenticate(username: String, password: String): Boolean
    fun getUsers(): List<UserDto>
}
