package controller

import (
	"database/sql"
	"encoding/json"
	_ "github.com/go-sql-driver/mysql"
	"hackathon/model"
	"hackathon/usecase"
	"log"
	"net/http"
)

func SearchUser(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")
	name := r.FormValue("name")
	if name == "" {
		log.Println("fail: name is empty")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var rows = usecase.Search(name, w, db)

	users := make([]model.UserResForHTTPGet, 0)
	for rows.Next() {
		var u model.UserResForHTTPGet
		if err := rows.Scan(&u.Id, &u.Name, &u.Age); err != nil {
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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(bytes)
}
