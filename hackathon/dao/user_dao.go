package dao

import (
	"database/sql"
	"hackathon/model"
	"log"
	"net/http"
)

func UserFetch(w http.ResponseWriter, db *sql.DB, userID string) *sql.Rows {
	log.Printf("daoまで来たよ")
	rows, err := db.Query("SELECT userID, userNAME, email FROM user WHERE userID = ?", userID)
	if err != nil {
		log.Printf("fail: db.Query, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}
	log.Println("rows:", rows)
	return rows
}

func UserRegister(user model.UserResForHTTPPOST, w http.ResponseWriter, db *sql.DB) {
	if _, err := db.Exec("INSERT INTO user (userID, userNAME, email) VALUES(?, ?, ?)", user.Id, user.Name, user.Email); err != nil {
		log.Printf("fail: db.Exec %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
