package websocket

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/jackschu/io_game/pkg/game"
	"log"
)

type Client struct {
	ID   string
	Conn *websocket.Conn	
	Room *Room
	Info *game.PlayerInfo
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
		c.Player.Direction := string(p)
		
		fmt.Printf("Message Received: %+v\n", string(p))
	}
}
