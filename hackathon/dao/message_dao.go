package dao

import (
	"database/sql"
	"hackathon/model"
	"log"
	"net/http"
)

//func SearchName(name string, w http.ResponseWriter, db *sql.DB) *sql.Rows {
//	rows, err := db.Query("SELECT id, name, age FROM user WHERE name = ?", name)
//	if err != nil {
//		log.Printf("fail: db.Query, %v\n", err)
//		w.WriteHeader(http.StatusInternalServerError)
//		return nil
//	}
//	return rows
//}

func MessagePost(message model.MessageResForHTTPPOST, w http.ResponseWriter, db *sql.DB) {
	row := db.QueryRow("SELECT userID from user where userName = ?", message.User)
	var UserId string
	if err := row.Scan(&UserId); err != nil {
		log.Printf("fail: row.Scan %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	row2 := db.QueryRow("SELECT channelID from channel where channelName = ?", message.Channel)
	var ChannelId string
	if err := row2.Scan(&ChannelId); err != nil {
		log.Printf("fail: row.Scan %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if _, err := db.Exec("INSERT INTO message (messageId, userId, channelId, posted_at, content, edit) VALUES(?, ?, ?, ?, ?, 0)", message.MessageId, UserId, ChannelId, message.PostedAt, message.Content); err != nil {
		log.Printf("fail: db.Exec %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
