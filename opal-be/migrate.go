package main

import (
	"log"
	"nikhilcodes.in/opal/internal/config"
	"nikhilcodes.in/opal/internal/db"
	"nikhilcodes.in/opal/internal/model"
)

func main() {
	cfg := config.Load()

	if err := db.SetupDB(cfg); err != nil {
		log.Fatalf("Failed to set up database: %v", err)
	}

	if err := db.Connections.AutoMigrate(
		&model.Project{},
		&model.ProjectUser{},
		&model.ProjectRole{},
		&model.ProjectUserRole{},
	); err != nil {
		log.Fatalf("Failed to migrate: %v", err)
	}
}
