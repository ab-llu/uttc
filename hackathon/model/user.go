package model

type UserId struct {
	Id string `json:"id"`
}

type UserResForHTTPGet struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}

type UserResForHTTPPOST struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}
