package dao

import (
	"database/sql"
	"hackathon/model"
	"log"
	"net/http"
)

func SearchName(name string, w http.ResponseWriter, db *sql.DB) *sql.Rows {
	rows, err := db.Query("SELECT id, name, age FROM user WHERE name = ?", name)
	if err != nil {
		log.Printf("fail: db.Query, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}
	return rows
}

func RegisterUser(user model.UserResForHTTPPOST, w http.ResponseWriter, db *sql.DB) {
	if _, err := db.Exec("INSERT INTO user (id, name, age) VALUES(?, ?, ?)", user.Id, user.Name, user.Age); err != nil {
		log.Printf("fail: db.Exec %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
