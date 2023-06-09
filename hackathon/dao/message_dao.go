package dao

import (
	"database/sql"
	"hackathon/model"
	"log"
	"math/rand"
	"net/http"
	"time"
)

func MessagePost(message model.MessageResForHTTPPost, w http.ResponseWriter, db *sql.DB) {
	row := db.QueryRow("SELECT channelID from channel where channelName = ?", message.Channel)
	var ChannelId string
	if err := row.Scan(&ChannelId); err != nil {
		log.Printf("fail: row.Scan %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if _, err := db.Exec("INSERT INTO message (messageId, userId, channelId, posted_at, content, edit, importance) VALUES(?, ?, ?, ?, ?, 0, ?)", message.MessageId, message.User, ChannelId, message.PostedAt, message.Content, message.Importance); err != nil {
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
		message.UserId = m.UserId
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

func MessageFetch(w http.ResponseWriter, db *sql.DB, channel string) []model.MessageResForFetch {
	//channel名からchannelIDを取得
	row := db.QueryRow("SELECT channelID from channel where channelName = ?", channel)
	var ChannelId string
	if err := row.Scan(&ChannelId); err != nil {
		log.Printf("fail: row.Scan %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}

	//全てのカラムのrandをupdate
	allrows, err := db.Query("SELECT messageId, importance FROM message")
	if err != nil {
		log.Printf("fail: rand update, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}
	for allrows.Next() {
		var id string
		var imp int
		if err := allrows.Scan(&id, &imp); err != nil {
			log.Printf("fail: allrows.Scan, %v\n", err)

			if err := allrows.Close(); err != nil { // 500を返して終了するが、その前にrowsのClose処理が必要
				log.Printf("fail: rows.Close(), %v\n", err)
			}
			w.WriteHeader(http.StatusInternalServerError)
			return nil
		}
		var randomNumber int
		rand.Seed(time.Now().UnixNano())
		if imp == 1 {
			randomNumber = rand.Intn(100)
		} else if imp == 2 {
			randomNumber = 100 - rand.Intn(70)
		} else {
			randomNumber = 100 - rand.Intn(40)
		}
		db.Exec("UPDATE message SET rand = ? where messageId = ?", randomNumber, id)
	}

	//条件に合うカラムをrandの順でとってくる
	rows, err := db.Query("SELECT * FROM message where channelId = ? ORDER BY rand DESC", ChannelId)
	if err != nil {
		log.Printf("fail: db.Query, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return nil
	}

	messages := make([]model.MessageResForFetch, 0)
	for rows.Next() {
		var m model.MessageResForHTTPGet
		if err := rows.Scan(&m.MessageId, &m.UserId, &m.ChannelId, &m.PostedAt, &m.Content, &m.Edit, &m.Importance, &m.Rand); err != nil {
			log.Printf("fail: rows.Scan, %v\n", err)

			if err := rows.Close(); err != nil { // 500を返して終了するが、その前にrowsのClose処理が必要
				log.Printf("fail: rows.Close(), %v\n", err)
			}
			w.WriteHeader(http.StatusInternalServerError)
			return nil
		}

		var message model.MessageResForFetch
		message.MessageId = m.MessageId
		message.UserId = m.UserId
		message.PostedAt = m.PostedAt
		message.Content = m.Content
		message.Edit = m.Edit
		message.Importance = m.Importance
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
