package model

import "time"

type MessageId struct {
	Id string `json:"id"`
}

type MessageResForHTTPGet struct {
	MessageId string    `json:"messageId"`
	User      string    `json:"user"`
	Channel   string    `json:"channel"`
	PostedAt  time.Time `json:"posted_at"`
	Content   string    `json:"message"`
	Edit      bool      `json:"edit"`
}

type MessageResForHTTPPOST struct {
	MessageId string    `json:"messageId"`
	User      string    `json:"user"`
	Channel   string    `json:"channel"`
	PostedAt  time.Time `json:"posted_at"`
	Content   string    `json:"message"`
	Edit      bool      `json:"edit"`
}