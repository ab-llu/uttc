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
	log.Printf("usecaseまで来たよ")
	userID := r.FormValue("uid")

	var user = dao.UserFetch(w, db, userID)
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
