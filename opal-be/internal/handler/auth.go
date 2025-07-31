package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"nikhilcodes.in/opal/internal/model"
	"nikhilcodes.in/opal/internal/service"
)

type AuthHandler struct {
	Service service.AuthService
}

func NewAuthHandler(s service.AuthService) *AuthHandler {
	return &AuthHandler{Service: s}
}

func (h *AuthHandler) HandleAuth(c *gin.Context) {
	var input model.Credential
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	auth := h.Service.DoAuth(c, input)
	c.JSON(http.StatusOK, auth)
}

func (h *AuthHandler) HandleGetAuthUser(c *gin.Context) {
	user, err := h.Service.GetAuthUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}
	c.JSON(http.StatusOK, user)
}
