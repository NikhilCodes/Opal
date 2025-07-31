package model

import (
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"time"
)

type Project struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	SecretKey   string    `json:"secret_key"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

type ProjectUser struct {
	ID   uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name string    `json:"name"`

	Email    string `gorm:"uniqueIndex:idx_project_email" json:"email,omitempty"`
	Phone    string `gorm:"uniqueIndex:idx_project_phone" json:"phone,omitempty"`
	Username string `gorm:"uniqueIndex:idx_project_username" json:"username,omitempty"`

	Password *string `json:"password,omitempty"`

	ProjectID *uuid.UUID `gorm:"index;uniqueIndex:idx_project_email,priority:1;uniqueIndex:idx_project_phone,priority:1;uniqueIndex:idx_project_username,priority:1" json:"-"`

	IsEnabled bool `gorm:"default:true" json:"is_enabled"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	UserRoles []ProjectUserRole `gorm:"foreignKey:UserID;references:ID" json:"user_roles,omitempty"`
	Roles     []ProjectRole     `gorm:"many2many:project_user_roles;joinForeignKey:UserID;joinReferences:RoleID" json:"roles,omitempty"`
}

func (pu *ProjectUser) BeforeCreate(tx *gorm.DB) (err error) {
	// hash the password
	if pu.Password != nil && *pu.Password != "" {
		hashedPasswordBytes, err := bcrypt.GenerateFromPassword([]byte(*pu.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		// set the hashed password
		hashedPassword := string(hashedPasswordBytes)
		pu.Password = &hashedPassword
	} else {
		return gorm.ErrInvalidData
	}

	return nil
}

func (pu *ProjectUser) BeforeUpdate(tx *gorm.DB) (err error) {
	if pu.Password != nil && *pu.Password == "" {
		pu.Password = nil
	}

	if pu.ProjectID == nil || *pu.ProjectID == uuid.Nil || pu.Name == "" || pu.Email == "" {
		return gorm.ErrInvalidData
	}

	if pu.Password != nil {
		// hash the password
		hashedPasswordBytes, err := bcrypt.GenerateFromPassword([]byte(*pu.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		// set the hashed password
		hashedPassword := string(hashedPasswordBytes)
		pu.Password = &hashedPassword
	}

	return nil
}

func (pu *ProjectUser) AfterFind(tx *gorm.DB) (err error) {
	return nil
}

type ProjectRole struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name      string    `json:"name"`
	ProjectID uuid.UUID `json:"-"`
	IsEnabled bool      `gorm:"default:true" json:"is_enabled"`
}

type ProjectUserRole struct {
	ID        uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID    *uuid.UUID `gorm:"not null" json:"user_id"`
	RoleID    uuid.UUID  `gorm:"not null" json:"role_id"`
	ProjectID uuid.UUID  `gorm:"not null" json:"project_id"`
}
