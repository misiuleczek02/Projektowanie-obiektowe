package models

import "time"

type Weather struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	City        string    `gorm:"index" json:"city"`
	Country     string    `json:"country"`
	Temperature float64   `json:"temperature_celsius"`
	WindSpeed   float64   `json:"wind_speed_kmh"`
	Condition   string    `json:"condition"`
	RetrievedAt time.Time `json:"retrieved_at"`
}

type WeatherRequest struct {
	Locations []string `json:"locations"`
}

type WeatherResponse struct {
	Data []Weather `json:"data"`
}
