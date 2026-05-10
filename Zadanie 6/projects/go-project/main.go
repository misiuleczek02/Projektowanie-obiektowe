package main

import (
	"log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"zadanie4/handlers"
	"zadanie4/repository"
)

func main() {
	if err := repository.InitDB(); err != nil {
		log.Fatalf("failed to initialize database: %v", err)
	}

	if err := repository.SeedInitialData(); err != nil {
		log.Fatalf("failed to seed initial data: %v", err)
	}

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	handlers.RegisterWeatherRoutes(e)

	log.Println("Weather proxy server is running on http://localhost:8080")
	if err := e.Start(":8080"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
