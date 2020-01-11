package websocket

import (
	"github.com/gorilla/websocket"
	"github.com/jackschu/io_game/pkg/metrics"
	"log"
	"sync"
)

type Client struct {
	ID    uint32
	Conn  *websocket.Conn
	Room  *Room
	Queue *Queue
	Mutex sync.Mutex
}

func (c *Client) SetRoom(room *Room) {
	c.Mutex.Lock()
	c.Room = room
	c.Mutex.Unlock()
}

func (c *Client) HasRoom() bool {
	c.Mutex.Lock()
	hasRoom := c.Room != nil
	c.Mutex.Unlock()
	return hasRoom
}

func (c *Client) Read() {
	atomic.AddUint32(&metrics.WebsocketsOpen, 1)
	defer func() {
		if c.HasRoom() {
			c.Room.Leaving <- c
		} else {
			c.Queue.RemoveClient(c)
		}
		atomic.AddUint32(&metrics.WebsocketsOpen, ^uint32(0))

		c.Conn.Close()
	}()

	for {
		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		if !c.HasRoom() {
			continue
		}

		c.Room.SendMove(c, p)
	}
}
