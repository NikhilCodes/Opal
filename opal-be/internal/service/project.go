package service

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"math/rand"
	"nikhilcodes.in/opal/internal/db"
	"nikhilcodes.in/opal/internal/model"
	"regexp"
	"strconv"
	"strings"
)

type ProjectService interface {
	GetAllProjects(ctx *gin.Context) ([]model.Project, error)
	CreateProject(ctx *gin.Context, p model.Project) (*model.Project, error)
	GetProjectByID(ctx *gin.Context, pid string) (model.Project, error)
	GetAllUserOfProject(ctx *gin.Context, pid uuid.UUID) ([]model.ProjectUser, error)
	CreateProjectUser(ctx *gin.Context, pid uuid.UUID, pu model.ProjectUser) (*model.ProjectUser, error)
	DeleteProjectUser(ctx *gin.Context, pid uuid.UUID, uid uuid.UUID) error
	GetAllRolesOfProject(ctx *gin.Context, pid uuid.UUID) ([]model.ProjectRole, error)
	CreateProjectRole(ctx *gin.Context, pid uuid.UUID, role string) error
	DeleteProjectRole(ctx *gin.Context, pid uuid.UUID, rid uuid.UUID) error
}

type projectService struct {
}

func NewProjectService() ProjectService {
	return &projectService{}
}

func (s *projectService) GetAllProjects(ctx *gin.Context) ([]model.Project, error) {
	var projects []model.Project
	err := db.DB(ctx).Find(&projects).Error
	return projects, err
}

func (s *projectService) CreateProject(ctx *gin.Context, p model.Project) (*model.Project, error) {
	err := db.DB(ctx).Create(&p).Error
	if err != nil {
		return nil, err
	}
	secretKey := strings.ReplaceAll(p.ID.String(), "-", "")
	err = db.DB(ctx).Model(&model.Project{}).Where("id = ?", p.ID).Update("secret_key", secretKey).Error
	return &p, err
}

func (s *projectService) GetProjectByID(ctx *gin.Context, pid string) (model.Project, error) {
	var project model.Project
	err := db.DB(ctx).First(&project, "id = ?", pid).Error
	return project, err
}

func (s *projectService) GetAllUserOfProject(ctx *gin.Context, pid uuid.UUID) ([]model.ProjectUser, error) {
	var users []model.ProjectUser
	err := db.DB(ctx).
		Preload("Roles").
		Find(&users, model.ProjectUser{
			ProjectID: &pid,
		}).
		Error
	return users, err
}

func (s *projectService) GetAllRolesOfProject(ctx *gin.Context, pid uuid.UUID) ([]model.ProjectRole, error) {
	var roles []model.ProjectRole
	err := db.DB(ctx).Find(&roles, model.ProjectRole{
		ProjectID: pid,
	}).Error
	return roles, err
}

func (s *projectService) CreateProjectRole(ctx *gin.Context, pid uuid.UUID, role string) error {
	newRole := model.ProjectRole{
		ProjectID: pid,
		Name:      role,
	}
	return db.DB(ctx).Create(&newRole).Error
}

func (s *projectService) CreateProjectUser(ctx *gin.Context, pid uuid.UUID, pu model.ProjectUser) (*model.ProjectUser, error) {
	pu.ProjectID = &pid
	if pu.Username == "" {
		username := strings.ToLower(pu.Name)
		// replace all non-alphanumeric characters with underscores
		re := regexp.MustCompile(`[^a-z ]`)
		username = re.ReplaceAllString(username, "")
		// replace all spaces with underscores
		username = strings.ReplaceAll(username, " ", "-")
		// ensure username is unique by appending a number if necessary
		var existingUser model.ProjectUser
		for i := 1; ; i++ {
			err := db.DB(ctx).Model(&model.ProjectUser{}).
				Where("project_id = ? AND username = ?", pid, username).
				First(&existingUser).Error
			if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
				break // no existing user found, we can use this username
			}
			// append a number to the username to make it unique
			username = strings.TrimSuffix(username, "-") + "-" + strconv.FormatInt(rand.Int63n(17), 16)
		}
		pu.Username = username
	}
	if pu.Phone != "" {
		re := regexp.MustCompile(`[^0-9]`)
		pu.Phone = re.ReplaceAllString(pu.Phone, "")
	}
	err := db.DB(ctx).Create(&pu).Error
	if err != nil {
		return nil, err
	}
	return &pu, nil
}

func (s *projectService) DeleteProjectUser(ctx *gin.Context, pid uuid.UUID, uid uuid.UUID) error {
	// First, delete all user roles for this user
	err := db.DB(ctx).Where("user_id = ? AND project_id = ?", uid, pid).Delete(&model.ProjectUserRole{}).Error
	if err != nil {
		return err
	}
	
	// Then delete the user
	err = db.DB(ctx).Where("id = ? AND project_id = ?", uid, pid).Delete(&model.ProjectUser{}).Error
	return err
}

func (s *projectService) DeleteProjectRole(ctx *gin.Context, pid uuid.UUID, rid uuid.UUID) error {
	// First, delete all user roles that reference this role
	err := db.DB(ctx).Where("role_id = ? AND project_id = ?", rid, pid).Delete(&model.ProjectUserRole{}).Error
	if err != nil {
		return err
	}
	
	// Then delete the role
	err = db.DB(ctx).Where("id = ? AND project_id = ?", rid, pid).Delete(&model.ProjectRole{}).Error
	return err
}
