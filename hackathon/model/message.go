package model

import "time"

type MessageId struct {
	Id string `json:"id"`
}

type MessageResForDisplay struct {
	MessageId string  `json:"messageId"`
	PostedAt  []uint8 `json:"posted_at"`
	User      string  `json:"user"`
	UserId    string  `json:"userID"`
	Content   string  `json:"message"`
	Edit      bool    `json:"edit"`
}

type MessageResForFetch struct {
	MessageId  string  `json:"messageId"`
	PostedAt   []uint8 `json:"posted_at"`
	User       string  `json:"user"`
	UserId     string  `json:"userID"`
	Content    string  `json:"message"`
	Edit       bool    `json:"edit"`
	Importance int     `json:"importance"`
}

type MessageResForHTTPGET struct {
	MessageId string  `json:"messageId"`
	UserId    string  `json:"userId"`
	ChannelId string  `json:"channelId"`
	PostedAt  []uint8 `json:"posted_at"`
	Content   string  `json:"message"`
	Edit      bool    `json:"edit"`
}

type MessageResForHTTPGet struct {
	MessageId  string  `json:"messageId"`
	UserId     string  `json:"userId"`
	ChannelId  string  `json:"channelId"`
	PostedAt   []uint8 `json:"posted_at"`
	Content    string  `json:"message"`
	Edit       bool    `json:"edit"`
	Importance int     `json:"importance"`
	Rand       int     `json:"rand"`
}

type MessageResForHTTPPOST struct {
	MessageId string    `json:"messageId"`
	User      string    `json:"user"`
	Channel   string    `json:"channel"`
	PostedAt  time.Time `json:"posted_at"`
	Content   string    `json:"message"`
	Edit      bool      `json:"edit"`
}

type MessageResForHTTPPost struct {
	MessageId  string    `json:"messageId"`
	User       string    `json:"user"`
	Channel    string    `json:"channel"`
	PostedAt   time.Time `json:"posted_at"`
	Content    string    `json:"message"`
	Edit       bool      `json:"edit"`
	Importance int       `json:"importance"`
}

type MessageResForEdit struct {
	MessageId string `json:"id"`
	Content   string `json:"edited"`
}

type MessageResForDelete struct {
	MessageId string `json:"id"`
}
