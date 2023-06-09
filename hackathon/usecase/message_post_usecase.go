package usecase

import (
	"database/sql"
	"encoding/json"
	"github.com/oklog/ulid"
	"hackathon/dao"
	"hackathon/model"
	"log"
	"math/rand"
	"net/http"
	"time"
)

func MessagePost(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")
	var message model.MessageResForHTTPPost
	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		log.Printf("fail: json.Decode %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	//異常なリクエストを除外
	if message.Content == "" || len(message.User) > 50 || len(message.Channel) > 50 {
		log.Println("fail: message information is wrong")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	//idの割り当て
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy)
	message.PostedAt = t
	message.MessageId = id.String()
	//sqlに挿入
	dao.MessagePost(message, w, db)

	//json型の成功メッセージを送る
	var messageId model.UserId
	messageId.Id = message.MessageId
	result, err := json.Marshal(messageId)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(result)
}
