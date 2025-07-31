package db

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"nikhilcodes.in/opal/internal/config"
)

var Connections *gorm.DB

func SetupDB(cfg *config.Config) error {
	db, err := gorm.Open(postgres.Open(cfg.DBURL), &gorm.Config{
		Logger:                                   logger.Default.LogMode(logger.Info),
		DisableForeignKeyConstraintWhenMigrating: true,
		SkipDefaultTransaction:                   true,
		DisableNestedTransaction:                 true,
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
		return err
	}

	Connections = db
	return nil
}

func DB(c *gin.Context) *gorm.DB {
	return Connections.WithContext(c.Request.Context())
}
