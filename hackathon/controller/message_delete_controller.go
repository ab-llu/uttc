package controller

import (
	"database/sql"
	"encoding/json"
	"hackathon/model"
	"hackathon/usecase"
	"log"
	"net/http"
)

func MessageDelete(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")
	var id model.MessageResForDelete
	if err := json.NewDecoder(r.Body).Decode(&id); err != nil {
		log.Printf("fail: json.Decode %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	usecase.MessageDelete(id, w, db)

	//json型の成功メッセージを送る
	var messageId model.UserId
	messageId.Id = id.MessageId
	result, err := json.Marshal(messageId)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(result)
}
