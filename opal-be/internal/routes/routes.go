package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"nikhilcodes.in/opal/internal/config"
	"nikhilcodes.in/opal/internal/handler"
	"nikhilcodes.in/opal/internal/middleware"
	"nikhilcodes.in/opal/internal/service"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173", "http://localhost:3000"},
		AllowHeaders: []string{"content-type", "x-environment", "x-api-key", "authorization"},
	}))
	api := r.Group("/api")
	{
		project := api.Group("/project")
		{
			projectService := service.NewProjectService()
			h := handler.NewProjectHandler(projectService)
			project.GET("/", h.HandleGetProjects)
			project.POST("/", h.HandleCreateProject)
			project.GET("/:pid", h.HandleGetProjectById)
			project.GET("/:pid/user", h.HandleGetProjectUsers)
			project.POST("/:pid/user", h.HandleCreateProjectUser)
			project.GET("/:pid/role", h.HandleGetProjectRoles)
			project.POST("/:pid/role", h.HandleCreateProjectRole)
		}

		// SDK consumption
		auth := api.Group("/auth")
		auth.Use(middleware.ApiKeyMiddleware())
		{
			authService := service.NewAuthService()
			h := handler.NewAuthHandler(authService)
			auth.POST("/", h.HandleAuth)
			auth.GET("/user", middleware.JwtMiddleware(), h.HandleGetAuthUser)
		}
	}

	return r
}
