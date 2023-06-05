package model

import "time"

type MessageId struct {
	Id string `json:"id"`
}

type MessageResForDisplay struct {
	MessageId string  `json:"messageId"`
	PostedAt  []uint8 `json:"posted_at"`
	User      string  `json:"user"`
	Content   string  `json:"message"`
	Edit      bool    `json:"edit"`
}

type MessageResForHTTPGET struct {
	MessageId string  `json:"messageId"`
	UserId    string  `json:"userId"`
	ChannelId string  `json:"channelId"`
	PostedAt  []uint8 `json:"posted_at"`
	Content   string  `json:"message"`
	Edit      bool    `json:"edit"`
}

type MessageResForHTTPPOST struct {
	MessageId string    `json:"messageId"`
	User      string    `json:"user"`
	Channel   string    `json:"channel"`
	PostedAt  time.Time `json:"posted_at"`
	Content   string    `json:"message"`
	Edit      bool      `json:"edit"`
}
