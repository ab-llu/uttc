package usecase

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"hackathon/dao"
	"log"
	"net/http"
)

func UserFetch(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	userID := r.FormValue("uid")

	var user, err = dao.UserFetch(w, db, userID)
	if err != nil {
		log.Printf("fail: fetch user, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Println("user:", user)

	bytes, err := json.Marshal(user)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Println("bytes:", bytes)

	w.Write(bytes)
	fmt.Fprint(w, "Registration successful!")
}
