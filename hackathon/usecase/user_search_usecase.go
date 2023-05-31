package usecase

import (
	"database/sql"
	"hackathon/dao"
	"net/http"
)

func Search(name string, w http.ResponseWriter, db *sql.DB) *sql.Rows {
	return dao.SearchName(name, w, db)
}
