package websocket

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Room *Room
}

type Message struct {
	Type   int    `json:"type"`
	Action string `json:"action"`
}

func (c *Client) Read() {
	defer func() {
		c.Room.Leaving <- c
		c.Conn.Close()
	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		message := Message{Type: messageType, Action: string(p)}
		c.Room.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
