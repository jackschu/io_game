package websocket

import (
	"github.com/gorilla/websocket"
	"github.com/jackschu/io_game/pkg/communication"
	"log"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Room *Room
}

func (c *Client) Read() {
	defer func() {
		c.Room.Leaving <- c
		c.Conn.Close()
	}()

	for {
		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		c.Room.Actions <- &communication.Action{ID: c.ID, Move: string(p)}
	}
}
