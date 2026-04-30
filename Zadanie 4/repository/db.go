package repository

import (
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"

	"zadanie4/models"
)

var DB *gorm.DB

func InitDB() error {
	database, err := gorm.Open(sqlite.Open("weather.db"), &gorm.Config{})
	if err != nil {
		return err
	}

	DB = database
	return DB.AutoMigrate(&models.Weather{})
}

func SeedInitialData() error {
	if DB == nil {
		return gorm.ErrInvalidDB
	}

	var count int64
	if err := DB.Model(&models.Weather{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	samples := []models.Weather{
		{City: "Berlin", Country: "Germany", Temperature: 12.3, WindSpeed: 18.0, Condition: "Cloudy", RetrievedAt: time.Now()},
		{City: "Paris", Country: "France", Temperature: 15.1, WindSpeed: 12.4, Condition: "Partly cloudy", RetrievedAt: time.Now()},
		{City: "New York", Country: "USA", Temperature: 9.8, WindSpeed: 22.5, Condition: "Clear", RetrievedAt: time.Now()},
	}

	return DB.Create(&samples).Error
}

func SaveWeather(weather *models.Weather) error {
	return DB.Save(weather).Error
}

func ListWeather() ([]models.Weather, error) {
	var list []models.Weather
	if err := DB.Order("city asc").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func FindWeatherByCity(city string) (*models.Weather, error) {
	var record models.Weather
	if err := DB.Where("lower(city) = lower(?)", city).First(&record).Error; err != nil {
		return nil, err
	}
	return &record, nil
}
