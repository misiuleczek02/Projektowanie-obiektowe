package handlers

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"

	"zadanie4/models"
	"zadanie4/proxy"
	"zadanie4/repository"
)

var weatherProxy = proxy.NewWeatherProxy()

func RegisterWeatherRoutes(e *echo.Echo) {
	e.GET("/weather", GetWeather)
	e.POST("/weather", PostWeather)
}

func GetWeather(c echo.Context) error {
	citiesParam := c.QueryParam("cities")
	cityParam := c.QueryParam("city")

	if citiesParam == "" && cityParam == "" {
		list, err := repository.ListWeather()
		if err != nil {
			c.Logger().Error("Failed to list weather data", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to retrieve weather data"})
		}
		return c.JSON(http.StatusOK, models.WeatherResponse{Data: list})
	}

	locations := parseCities(cityParam, citiesParam)
	if len(locations) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "No valid locations provided"})
	}
	return fetchSaveAndReturn(c, locations)
}

func PostWeather(c echo.Context) error {
	var req models.WeatherRequest
	if err := c.Bind(&req); err != nil {
		c.Logger().Error("Failed to bind request", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}
	if len(req.Locations) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Locations list cannot be empty"})
	}
	return fetchSaveAndReturn(c, req.Locations)
}

func fetchSaveAndReturn(c echo.Context, locations []string) error {
	var results []models.Weather
	const maxLocations = 10

	if len(locations) > maxLocations {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Too many locations requested"})
	}

	for _, location := range locations {
		trimmed := strings.TrimSpace(location)
		if trimmed == "" {
			continue
		}
		if len(trimmed) > 100 {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Location name too long"})
		}

		weather, err := weatherProxy.FetchWeather(trimmed)
		if err != nil {
			c.Logger().Error("Failed to fetch weather for location", trimmed, err)
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Failed to fetch weather data for " + trimmed})
		}
		if err := repository.SaveWeather(&weather); err != nil {
			c.Logger().Error("Failed to save weather data", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to save weather data"})
		}
		results = append(results, weather)
	}

	if len(results) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "No valid locations provided"})
	}

	return c.JSON(http.StatusOK, models.WeatherResponse{Data: results})
}

func parseCities(cityParam, citiesParam string) []string {
	if citiesParam != "" {
		parts := strings.Split(citiesParam, ",")
		var locations []string
		for _, part := range parts {
			trimmed := strings.TrimSpace(part)
			if trimmed != "" {
				locations = append(locations, trimmed)
			}
		}
		return locations
	}
	if cityParam != "" {
		return []string{strings.TrimSpace(cityParam)}
	}
	return nil
}
