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

func MessageEdit(edit model.MessageResForEdit, w http.ResponseWriter, db *sql.DB) {
	_, err := db.Exec("UPDATE message SET content = ?, edit = TRUE where messageID = ?", edit.Content, edit.MessageId)
	if err != nil {
		log.Printf("fail: UPDATE message %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func MessageDelete(id model.MessageResForDelete, w http.ResponseWriter, db *sql.DB) {
	_, err := db.Exec("DELETE from message where messageID = ?", id.MessageId)
	if err != nil {
		log.Printf("fail: UPDATE message %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func MessageDisplay(w http.ResponseWriter, db *sql.DB, channel string) []model.MessageResForDisplay {
	row := db.QueryRow("SELECT channelID from channel where channelName = ?", channel)
	var ChannelId string
	if err := row.Scan(&ChannelId); err != nil {
		log.Printf("fail: row.Scan %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}

	rows, err := db.Query("SELECT * FROM message where channelId = ?", ChannelId)
	if err != nil {
		log.Printf("fail: db.Query, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}

	messages := make([]model.MessageResForDisplay, 0)
	for rows.Next() {
		var m model.MessageResForHTTPGET
		if err := rows.Scan(&m.MessageId, &m.UserId, &m.ChannelId, &m.PostedAt, &m.Content, &m.Edit); err != nil {
			log.Printf("fail: rows.Scan, %v\n", err)

			if err := rows.Close(); err != nil { // 500を返して終了するが、その前にrowsのClose処理が必要
				log.Printf("fail: rows.Close(), %v\n", err)
			}
			w.WriteHeader(http.StatusInternalServerError)
			return nil
		}

		var message model.MessageResForDisplay
		message.MessageId = m.MessageId
		message.PostedAt = m.PostedAt
		message.Content = m.Content
		message.Edit = m.Edit
		row := db.QueryRow("SELECT userName from user where userId = ?", m.UserId)
		var UserName string
		if err := row.Scan(&UserName); err != nil {
			log.Printf("fail: row.Scan %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return nil
		}
		message.User = UserName
		log.Printf("Name: %s", message.User)

		messages = append(messages, message)
	}

	return messages
}
