package websocket

import (
	"github.com/gorilla/websocket"
	"log"
)

type Client struct {
	ID    uint32
	Conn  *websocket.Conn
	Room  *Room
	Queue *Queue
}

func (c *Client) Read() {
	defer func() {
		if c.Room != nil {
			c.Room.Leaving <- c
		} else {
			c.Queue.RemoveClient(c)
		}

		c.Conn.Close()
	}()

	for {
		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		if c.Room == nil {
			continue
		}

		c.Room.SendMove(c, p)
	}
}
