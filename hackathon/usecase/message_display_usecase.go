package usecase

import (
	"database/sql"
	"encoding/json"
	"hackathon/dao"
	"hackathon/model"
	"log"
	"net/http"
)

func MessageDisplay(w http.ResponseWriter, db *sql.DB) {
	var rows = dao.MessageDisplay(w, db)

	users := make([]model.MessageResForHTTPGet, 0)
	for rows.Next() {
		var u model.MessageResForHTTPGet
		if err := rows.Scan(&u.MessageId, &u.User, &u.Channel, &u.PostedAt, &u.Content, &u.Edit); err != nil {
			log.Printf("fail: rows.Scan, %v\n", err)

			if err := rows.Close(); err != nil { // 500を返して終了するが、その前にrowsのClose処理が必要
				log.Printf("fail: rows.Close(), %v\n", err)
			}
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		users = append(users, u)
	}

	bytes, err := json.Marshal(users)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Request-Methods, Access-Control-Request-Headers")
	w.Header().Set("Access-Control-Max-Age", "86400")
	w.Write(bytes)
}
