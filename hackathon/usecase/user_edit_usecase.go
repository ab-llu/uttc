package usecase

import (
	"database/sql"
	"encoding/json"
	"hackathon/dao"
	"hackathon/model"
	"log"
	"net/http"
)

func UserEdit(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var user model.UserResForHTTPPOST
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Printf("fail: json.Decode %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	//異常なリクエストを除外
	if user.Name == "" || len(user.Name) > 50 {
		log.Println("fail: user information is wrong")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	//sqlに挿入
	dao.UserEdit(user, w, db)

	//json型の成功メッセージを送る
	var userId model.UserId
	userId.Id = user.Id
	result, err := json.Marshal(userId)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(result)
}
