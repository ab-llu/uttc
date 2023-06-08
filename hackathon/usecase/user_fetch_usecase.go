package usecase

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"hackathon/dao"
	"io/ioutil"
	"log"
	"net/http"
)

func UserFetch(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// AuthorizationヘッダーからIDトークンを取得
	idToken := r.Header.Get("Authorization")
	if idToken == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// IDトークンの検証
	userID, err := verifyIDToken(idToken)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var user = dao.UserFetch(w, db, userID)

	bytes, err := json.Marshal(user)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(bytes)
	fmt.Fprint(w, "Registration successful!")
}

func verifyIDToken(idToken string) (string, error) {
	// 公開鍵の取得
	keysURL := "https://www.googleapis.com/service_accounts/v1/metadata/x509/firebase-adminsdk-hbur8@term3-mahiro-suematsu.iam.gserviceaccount.com"
	resp, err := http.Get(keysURL)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	// JSONデコードして公開鍵を取得
	var keys map[string]string
	err = json.Unmarshal(body, &keys)
	if err != nil {
		return "", err
	}

	// 公開鍵の検証
	token, err := jwt.Parse(idToken, func(token *jwt.Token) (interface{}, error) {
		kid := token.Header["kid"].(string)
		publicKey := keys[kid]
		return jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey))
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("Invalid ID token")
	}

	// トークンの検証が成功した場合、ユーザーIDを返す
	claims := token.Claims.(jwt.MapClaims)
	userID := claims["sub"].(string)
	return userID, nil
}
