package websocket

import (
	"fmt"
	"github.com/jackschu/io_game/pkg/communication"
	"log"
	"sync/atomic"
	"time"
)

type Room struct {
	Joining     chan *Client
	Leaving     chan *Client
	Clients     map[*Client]bool
	Broadcast   chan Message
	Actions     chan *communication.Action
	PlayerCount uint32
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
		Actions:   make(chan *communication.Action, 8),
	}
}

func (room *Room) Start() {
	for {
		select {
		case client := <-room.Joining:
			room.Clients[client] = true
			atomic.AddUint32(&room.PlayerCount, 1)
			fmt.Println("Joining, Users in room: ", room.PlayerCount)
			select {
			case room.Actions <- &communication.Action{ID: client.ID, Move: "join"}:
			default:
				log.Println("full join")
			}
			break
		case client := <-room.Leaving:
			atomic.AddUint32(&room.PlayerCount, ^uint32(0))
			delete(room.Clients, client)
			fmt.Println("Leaving, Users in room: ", room.PlayerCount)
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
