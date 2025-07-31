package config

import (
	"fmt"
	"github.com/joho/godotenv"
	"os"
)

type Config struct {
	ServerPort string
	DBURL      string
}

func Load() *Config {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Couldn't load .env file, using system environment variables")
	}
	return &Config{
		ServerPort: getEnv("PORT", ":8080"),
		DBURL:      getEnv("DB_URL", "postgres://opal:opalpass@0.0.0.0:5432/postgres"),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
