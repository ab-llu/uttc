package usecase

import (
	"database/sql"
	"encoding/json"
	"hackathon/dao"
	"log"
	"net/http"
)

func MessageFetch(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	channel := r.FormValue("channel")

	var messages = dao.MessageFetch(w, db, channel)
	log.Println("messages:", messages)

	bytes, err := json.Marshal(messages)
	log.Println("bytes:", bytes)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
}
