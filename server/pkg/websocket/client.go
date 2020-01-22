package websocket

import (
	"github.com/gorilla/websocket"
	"github.com/jackschu/io_game/pkg/communication"
	"log"
	"sync"
)

type Client struct {
	ID        uint32
	Conn      *websocket.Conn
	Room      *Room
	Queue     *Queue
	Mutex     sync.Mutex
	WriteChan chan communication.WriteMessage
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

func (c *Client) Write() {
	for {
		message := <-c.WriteChan
		if err := c.Conn.WriteMessage(message.MessageType, message.Message); err != nil {
			log.Println(err)
		}
	}
}

func (c *Client) Read() {
	defer func() {
		if c.HasRoom() {
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

		if !c.HasRoom() {
			continue
		}

		c.Room.SendMove(c, p)
	}
}
