package usecase

import (
	"database/sql"
	"hackathon/dao"
	"hackathon/model"
	"log"
	"net/http"
)

func MessageEdit(message model.MessageResForEdit, w http.ResponseWriter, db *sql.DB) {
	//異常なリクエストを除外
	if message.Content == "" {
		log.Println("fail: message information is wrong")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	//sqlに挿入
	dao.MessageEdit(message, w, db)
}
