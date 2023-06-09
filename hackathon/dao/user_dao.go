package dao

import (
	"database/sql"
	"hackathon/model"
	"log"
	"net/http"
)

func UserFetch(w http.ResponseWriter, db *sql.DB, userID string) (model.UserResForHTTPGet, error) {
	row := db.QueryRow("SELECT userID, userNAME, email from user where userID = ?", userID)
	var userData model.UserResForHTTPGet
	log.Println("userData:", userData)
	if err := row.Scan(&userData.Id, &userData.Name, &userData.Email); err != nil {
		log.Printf("fail: row.Scan %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return model.UserResForHTTPGet{}, nil
	}
	log.Println("userData:", userData)
	return userData, nil
}

func UserRegister(user model.UserResForHTTPPOST, w http.ResponseWriter, db *sql.DB) {
	if _, err := db.Exec("INSERT INTO user (userID, userNAME, email) VALUES(?, ?, ?)", user.Id, user.Name, user.Email); err != nil {
		log.Printf("fail: db.Exec %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func UserEdit(user model.UserResForHTTPPOST, w http.ResponseWriter, db *sql.DB) {
	log.Println("dao")
	log.Println(user.Name)
	log.Println(user.Id)
	if _, err := db.Exec("UPDATE user SET userNAME = ? where userID = ? ", user.Name, user.Id); err != nil {
		log.Printf("fail: db.Exec %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
