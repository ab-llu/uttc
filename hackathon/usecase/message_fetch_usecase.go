package usecase

import (
	"database/sql"
	"encoding/json"
	"hackathon/dao"
	"log"
	"net/http"
	"strconv"
)

func MessageFetch(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	channel := r.FormValue("channel")
	leastStarsString := r.FormValue("leastStars")
	leastStars, err := strconv.Atoi(leastStarsString)
	if err != nil {
		log.Printf("fail: strconv.Atoi")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	withinDayString := r.FormValue("withinDay")
	withinDay, err := strconv.ParseBool(withinDayString)
	if err != nil {
		log.Printf("fail: strconv.ParseBool")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var messages = dao.MessageFetch(w, db, channel, leastStars, withinDay)
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
