package dao

import (
	"database/sql"
	"hackathon/model"
	"log"
	"net/http"
)

func UserFetch(w http.ResponseWriter, db *sql.DB, userID string) []model.UserResForHTTPGet {
	//row := db.QueryRow("SELECT userID, userNAME, email from user where userID = ?", userID)
	//var userData model.UserResForHTTPGet
	//log.Println("userData:", userData)
	//if err := row.Scan(&userData.Id, &userData.Name, &userData.Email); err != nil {
	//	log.Printf("fail: row.Scan %v\n", err)
	//	w.WriteHeader(http.StatusInternalServerError)
	//	return model.UserResForHTTPGet{}, nil
	//}
	//log.Println("userData:", userData)
	//return userData, nil

	rows, err := db.Query("SELECT * FROM user where userID = ?", userID)
	if err != nil {
		log.Printf("fail: db.Query, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}

	users := make([]model.UserResForHTTPGet, 0)
	for rows.Next() {
		var userData model.UserResForHTTPGet
		if err := rows.Scan(&userData.Id, &userData.Name, &userData.Email); err != nil {
			log.Printf("fail: rows.Scan, %v\n", err)

			if err := rows.Close(); err != nil { // 500を返して終了するが、その前にrowsのClose処理が必要
				log.Printf("fail: rows.Close(), %v\n", err)
			}
			w.WriteHeader(http.StatusInternalServerError)
			return nil
		}

		var user model.UserResForHTTPGet
		user.Id = userData.Id
		user.Name = userData.Name
		user.Email = userData.Email

		users = append(users, user)
	}

	return users
}

func UserRegister(user model.UserResForHTTPPOST, w http.ResponseWriter, db *sql.DB) {
	if _, err := db.Exec("INSERT INTO user (userID, userNAME, email) VALUES(?, ?, ?)", user.Id, user.Name, user.Email); err != nil {
		log.Printf("fail: db.Exec %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
