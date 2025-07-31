package model

type Credential struct {
	Identity string `json:"identity"`
	Password string `json:"password"`
	AuthType string `json:"auth_type"`
}

type AuthResponse struct {
	IsAuthenticated bool   `json:"is_authenticated"`
	Error           string `json:"error"`
}
