package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"nikhilcodes.in/opal/internal/db"
	"nikhilcodes.in/opal/internal/model"
	"strings"
)

func ApiKeyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := c.GetHeader("X-Api-Key")
		apiKey = strings.Split(apiKey, "_")[1]
		var projectId string
		err := db.DB(c).Model(&model.Project{}).
			Select("id").
			Where("secret_key = ?", apiKey).
			Scan(&projectId).
			Error
		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, err)
			return
		}
		c.Set("project_id", projectId)
		c.Next()
	}
}
