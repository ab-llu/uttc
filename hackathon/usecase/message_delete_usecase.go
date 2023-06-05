package usecase

import (
	"database/sql"
	"hackathon/dao"
	"hackathon/model"
	"log"
	"net/http"
)

func MessageDelete(id model.MessageResForDelete, w http.ResponseWriter, db *sql.DB) {
	//異常なリクエストを除外
	if id.MessageId == "" {
		log.Println("fail: message information is wrong")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	dao.MessageDelete(id, w, db)
}
