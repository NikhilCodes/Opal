package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"nikhilcodes.in/opal/internal/model"
	"nikhilcodes.in/opal/internal/service"
)

type ProjectHandler struct {
	Service service.ProjectService
}

func NewProjectHandler(s service.ProjectService) *ProjectHandler {
	return &ProjectHandler{Service: s}
}

func (h *ProjectHandler) HandleGetProjects(c *gin.Context) {
	projects, err := h.Service.GetAllProjects(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (h *ProjectHandler) HandleGetProjectById(c *gin.Context) {
	id := c.Param("pid")
	project, err := h.Service.GetProjectByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	c.JSON(http.StatusOK, project)
}

func (h *ProjectHandler) HandleCreateProject(c *gin.Context) {
	var input model.Project
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	created, err := h.Service.CreateProject(c, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	c.JSON(http.StatusOK, created)
}

func (h *ProjectHandler) HandleGetProjectUsers(c *gin.Context) {
	id := c.Param("pid")
	projects, err := h.Service.GetAllUserOfProject(c, uuid.MustParse(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch project users"})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (h *ProjectHandler) HandleCreateProjectUser(c *gin.Context) {
	id := c.Param("pid")
	var input model.ProjectUser
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	idUUID := uuid.MustParse(id)
	input.ProjectID = &idUUID
	user, err := h.Service.CreateProjectUser(c, idUUID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add project user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User added successfully", "data": user})
}

func (h *ProjectHandler) HandleGetProjectRoles(c *gin.Context) {
	id := c.Param("pid")
	roles, err := h.Service.GetAllRolesOfProject(c, uuid.MustParse(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch project roles"})
	}
	c.JSON(http.StatusOK, roles)
}

func (h *ProjectHandler) HandleCreateProjectRole(c *gin.Context) {
	id := c.Param("pid")
	var input model.ProjectRole
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	idUUID := uuid.MustParse(id)
	input.ProjectID = idUUID
	err := h.Service.CreateProjectRole(c, idUUID, input.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add project role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Role added successfully"})
}

func (h *ProjectHandler) HandleDeleteProjectUser(c *gin.Context) {
	pid := c.Param("pid")
	uid := c.Param("uid")
	
	pidUUID, err := uuid.Parse(pid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}
	
	uidUUID, err := uuid.Parse(uid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	
	err = h.Service.DeleteProjectUser(c, pidUUID, uidUUID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project user"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (h *ProjectHandler) HandleDeleteProjectRole(c *gin.Context) {
	pid := c.Param("pid")
	rid := c.Param("rid")
	
	pidUUID, err := uuid.Parse(pid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}
	
	ridUUID, err := uuid.Parse(rid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role ID"})
		return
	}
	
	err = h.Service.DeleteProjectRole(c, pidUUID, ridUUID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project role"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Role deleted successfully"})
}
