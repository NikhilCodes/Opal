package model

type Credential struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
	AuthType string `json:"auth_type"`
}

type AuthResponse struct {
	IsAuthenticated bool  `json:"is_authenticated"`
	Error           error `json:"error"`
}
