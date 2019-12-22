package websocket

import (
	"fmt"
	"github.com/jackschu/io_game/pkg/communication"
)

type Room struct {
	Joining   chan *Client
	Leaving   chan *Client
	Clients   map[*Client]bool
	Broadcast chan Message
	Actions   chan *communication.Action
}

type Message struct {
	Body string
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
			break
		case message := <-room.Broadcast:
			fmt.Println("Sending message to all clients in Room")
			for client, _ := range room.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}

}
