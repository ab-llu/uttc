package usecase

import (
	"database/sql"
	"github.com/oklog/ulid"
	"hackathon/dao"
	"hackathon/model"
	"log"
	"math/rand"
	"net/http"
	"time"
)

func MessagePost(message model.MessageResForHTTPPOST, w http.ResponseWriter, db *sql.DB) {
	//異常なリクエストを除外
	if message.Content == "" || len(message.User) > 50 || len(message.Channel) > 50 {
		log.Println("fail: user information is wrong")
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
}
