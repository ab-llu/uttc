package controller

import (
	"database/sql"
	"encoding/json"
	"hackathon/model"
	"hackathon/usecase"
	"log"
	"net/http"
)

func PostUser(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var user model.UserResForHTTPPOST
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Printf("fail: json.Decode %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	usecase.Register(user, w, db)

	//json型の成功メッセージを送る
	var userId model.UserId
	userId.Id = user.Id
	result, err := json.Marshal(userId)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(result)
}
