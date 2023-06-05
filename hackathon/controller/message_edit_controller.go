package controller

import (
	"database/sql"
	"encoding/json"
	"hackathon/model"
	"hackathon/usecase"
	"log"
	"net/http"
)

func MessageEdit(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")
	var edit model.MessageResForEdit
	if err := json.NewDecoder(r.Body).Decode(&edit); err != nil {
		log.Printf("fail: json.Decode %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	usecase.MessageEdit(edit, w, db)

	//json型の成功メッセージを送る
	var messageId model.UserId
	messageId.Id = edit.MessageId
	result, err := json.Marshal(messageId)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(result)
}
