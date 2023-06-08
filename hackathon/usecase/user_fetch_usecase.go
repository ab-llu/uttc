package usecase

import (
	"database/sql"
	"encoding/json"
	"hackathon/dao"
	"log"
	"net/http"
)

func UserFetch(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	userID := r.FormValue("uid")

	var user, _ = dao.UserFetch(w, db, userID)

	log.Println("user:", user)

	bytes, err := json.Marshal(user)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Println("bytes:", bytes)

	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
}
