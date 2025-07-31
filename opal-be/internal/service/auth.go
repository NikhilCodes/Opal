package service

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"nikhilcodes.in/opal/internal/db"
	"nikhilcodes.in/opal/internal/model"
	"os"
	"time"
)

type AuthService interface {
	DoAuth(ctx *gin.Context, credential model.Credential) model.AuthResponse
	GetAuthUser(ctx *gin.Context) (*model.ProjectUser, error)
}

type authService struct {
}

func NewAuthService() AuthService {
	return &authService{}
}

func (s *authService) DoAuth(ctx *gin.Context, credential model.Credential) model.AuthResponse {
	var jwt string
	var err error
	switch credential.AuthType {
	case "email-password":
		jwt, err = AuthByEmailPassword(ctx, credential.Identity, credential.Password, ctx.GetString("project_id"))
	case "username-password":
		jwt, err = AuthByUserPassword(ctx, credential.Identity, credential.Password, ctx.GetString("project_id"))
	default:
		err = fmt.Errorf("invalid auth_type")
	}

	if err != nil {
		return model.AuthResponse{
			IsAuthenticated: false,
			Error:           err.Error(),
		}
	}
	ctx.Header("authorization", "Bearer "+jwt)
	return model.AuthResponse{
		IsAuthenticated: true,
		Error:           "",
	}
}

func AuthByEmailPassword(ctx *gin.Context, email, password, projectId string) (string, error) {
	var user model.ProjectUser
	var isAuthenticated bool

	err := db.DB(ctx).
		Model(&model.ProjectUser{}).
		Select("id, password").
		Where("project_id = ? AND email = ?", projectId, email).
		First(&user).
		Error

	if err != nil {
		return "", err
	}

	isAuthenticated = ValidateBcrypt(*user.Password, password)
	if !isAuthenticated {
		return "", fmt.Errorf("incorrect password")
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func AuthByUserPassword(ctx *gin.Context, username, password, projectId string) (string, error) {
	var user model.ProjectUser
	var isAuthenticated bool

	err := db.DB(ctx).
		Model(&model.ProjectUser{}).
		Select("id, password").
		Where("project_id = ? AND username = ?", projectId, username).
		First(&user).
		Error

	if err != nil {
		return "", err
	}

	isAuthenticated = ValidateBcrypt(*user.Password, password)
	if !isAuthenticated {
		return "", fmt.Errorf("incorrect password")
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *authService) GetAuthUser(ctx *gin.Context) (*model.ProjectUser, error) {
	userId := ctx.GetString("user_id")
	var user model.ProjectUser
	err := db.DB(ctx).Model(&model.ProjectUser{}).First(&user, "id = ?", userId).Error
	if err != nil {
		return nil, err
	}
	user.Password = nil // Clear the password field before returning
	return &user, nil
}

func ValidateBcrypt(hash, textToCompare string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(textToCompare))
	return err == nil
}
