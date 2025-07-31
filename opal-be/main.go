package main

import (
	"log"
	"nikhilcodes.in/opal/internal/config"
	"nikhilcodes.in/opal/internal/db"
	"nikhilcodes.in/opal/internal/routes"
)

func main() {
	cfg := config.Load()

	if err := db.SetupDB(cfg); err != nil {
		log.Fatalf("Failed to set up database: %v", err)
	}

	r := routes.SetupRouter(cfg)
	//log.Printf("Starting server on %s\n", cfg.ServerPort)
	if err := r.Run(cfg.ServerPort); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
