package websocket

import (
	"fmt"
	"github.com/jackschu/io_game/pkg/communication"
	"time"
)

type Room struct {
	Joining   chan *Client
	Leaving   chan *Client
	Clients   map[*Client]bool
	Broadcast chan Message
	Actions   chan *communication.Action
}

type Message struct {
	Body      string
	Timestamp int64
}

func NewMessage(body string) *Message {
	return &Message{
		Body:      body,
		Timestamp: time.Now().UnixNano() / 1000000,
	}
}

func NewRoom() *Room {
	return &Room{
		Joining:   make(chan *Client),
		Leaving:   make(chan *Client),
		Clients:   make(map[*Client]bool),
		Broadcast: make(chan Message),
		Actions:   make(chan *communication.Action),
	}
}

func (room *Room) Start() {
	for {
		select {
		case client := <-room.Joining:
			room.Clients[client] = true
			fmt.Println("Joining, Users in room: ", len(room.Clients))
			room.Actions <- &communication.Action{ID: client.ID, Move: "join"}
			break
		case client := <-room.Leaving:
			delete(room.Clients, client)
			fmt.Println("Leaving, Users in room: ", len(room.Clients))
			room.Actions <- &communication.Action{ID: client.ID, Move: "leave"}
			break
		case message := <-room.Broadcast:
			for client, _ := range room.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}

}
