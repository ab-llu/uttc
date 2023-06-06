package controller

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"hackathon/usecase"
	"net/http"
)

func MessageDisplay(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	usecase.MessageDisplay(w, r, db)
}
