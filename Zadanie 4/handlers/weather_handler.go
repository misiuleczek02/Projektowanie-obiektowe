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
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusOK, models.WeatherResponse{Data: list})
	}

	locations := parseCities(cityParam, citiesParam)
	return fetchSaveAndReturn(c, locations)
}

func PostWeather(c echo.Context) error {
	var req models.WeatherRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request body"})
	}
	if len(req.Locations) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "locations list cannot be empty"})
	}
	return fetchSaveAndReturn(c, req.Locations)
}

func fetchSaveAndReturn(c echo.Context, locations []string) error {
	var results []models.Weather

	for _, location := range locations {
		trimmed := strings.TrimSpace(location)
		if trimmed == "" {
			continue
		}
		weather, err := weatherProxy.FetchWeather(trimmed)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		if err := repository.SaveWeather(&weather); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		results = append(results, weather)
	}

	if len(results) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "no valid locations provided"})
	}

	return c.JSON(http.StatusOK, models.WeatherResponse{Data: results})
}

func parseCities(cityParam, citiesParam string) []string {
	if citiesParam != "" {
		parts := strings.Split(citiesParam, ",")
		return parts
	}
	if cityParam != "" {
		return []string{cityParam}
	}
	return nil
}
