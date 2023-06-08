package controller

import (
	"database/sql"
	"hackathon/usecase"
	"log"
	"net/http"
)

func UserRegisterHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	switch r.Method {
	case http.MethodGet:
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Request-Methods, Access-Control-Request-Headers, Authorization, sub")
		w.Header().Set("Access-Control-Max-Age", "86400")
		usecase.UserFetch(w, r, db)

	case http.MethodPost:
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Request-Methods, Access-Control-Request-Headers, Authorization, sub")
		w.Header().Set("Access-Control-Max-Age", "86400")
		usecase.UserRegister(w, r, db)

	case http.MethodOptions:
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Request-Methods, Access-Control-Request-Headers, Authorization, sub")
		w.Header().Set("Access-Control-Max-Age", "86400")

	default:
		log.Printf("fail: HTTP Method is %s\n", r.Method)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
}
