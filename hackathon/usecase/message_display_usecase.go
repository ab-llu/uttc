package usecase

import (
	"database/sql"
	"encoding/json"
	"hackathon/dao"
	"log"
	"net/http"
)

func MessageDisplay(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	channel := r.FormValue("channel")

	var messages = dao.MessageDisplay(w, db, channel)

	bytes, err := json.Marshal(messages)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(bytes)
}
