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

func Register(user model.UserResForHTTPPOST, w http.ResponseWriter, db *sql.DB) {
	//異常なリクエストを除外
	if user.Name == "" || len(user.Name) > 50 || user.Age < 20 || user.Age > 80 {
		log.Println("fail: user information is wrong")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	//idの割り当て
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy)
	user.Id = id.String()
	//sqlに挿入
	dao.RegisterUser(user, w, db)
}
