package model

type UserId struct {
	Id string `json:"id"`
}

type UserResForHTTPGet struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type UserResForHTTPPOST struct {
	Id    string `json:"uid"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
