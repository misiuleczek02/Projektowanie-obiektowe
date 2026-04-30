package proxy

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"zadanie4/models"
)

type WeatherProxy struct {
	client *http.Client
}

type openMeteoResponse struct {
	CurrentWeather struct {
		Temperature float64 `json:"temperature"`
		Windspeed   float64 `json:"windspeed"`
		Weathercode int     `json:"weathercode"`
		Time        string  `json:"time"`
	} `json:"current_weather"`
}

var cityCoordinates = map[string]struct {
	Latitude  float64
	Longitude float64
	Country   string
}{
	"berlin":   {Latitude: 52.52, Longitude: 13.41, Country: "Germany"},
	"paris":    {Latitude: 48.85, Longitude: 2.35, Country: "France"},
	"new york": {Latitude: 40.71, Longitude: -74.01, Country: "USA"},
	"warsaw":   {Latitude: 52.23, Longitude: 21.01, Country: "Poland"},
	"tokyo":    {Latitude: 35.68, Longitude: 139.76, Country: "Japan"},
}

func NewWeatherProxy() *WeatherProxy {
	return &WeatherProxy{client: &http.Client{Timeout: 10 * time.Second}}
}

func (p *WeatherProxy) FetchWeather(city string) (models.Weather, error) {
	key := strings.ToLower(strings.TrimSpace(city))
	coords, ok := cityCoordinates[key]
	if !ok {
		return models.Weather{}, fmt.Errorf("unknown location: %s", city)
	}

	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current_weather=true&timezone=UTC", coords.Latitude, coords.Longitude)
	resp, err := p.client.Get(url)
	if err != nil {
		return models.Weather{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return models.Weather{}, errors.New("external API returned non-200 status")
	}

	var parsed openMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
		return models.Weather{}, err
	}

	weather := models.Weather{
		City:        strings.Title(key),
		Country:     coords.Country,
		Temperature: parsed.CurrentWeather.Temperature,
		WindSpeed:   parsed.CurrentWeather.Windspeed,
		Condition:   mapWeatherCode(parsed.CurrentWeather.Weathercode),
		RetrievedAt: time.Now().UTC(),
	}

	return weather, nil
}

func mapWeatherCode(code int) string {
	switch code {
	case 0:
		return "Clear"
	case 1, 2, 3:
		return "Partly cloudy"
	case 45, 48:
		return "Fog"
	case 51, 53, 55, 56, 57:
		return "Drizzle"
	case 61, 63, 65, 66, 67:
		return "Rain"
	case 71, 73, 75, 77, 85, 86:
		return "Snow"
	case 80, 81, 82:
		return "Rain showers"
	case 95, 96, 99:
		return "Thunderstorm"
	default:
		return "Unknown"
	}
}
