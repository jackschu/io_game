package websocket

import (
	"github.com/gorilla/websocket"
	"github.com/jackschu/io_game/pkg/communication"
	"log"
	"sync/atomic"
)

type Client struct {
	ID    uint32
	Conn  *websocket.Conn
	Room  *Room
	Queue *Queue
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

		if c.Room == nil {
			continue
		}

		select {
		case c.Room.GameLoop.Actions <- &communication.Action{ID: c.ID, Move: string(p)}:
		default:
			log.Println("channel full, num players:",
				atomic.LoadUint32(&c.Room.GameLoop.PlayerCount))
		}
	}
}
