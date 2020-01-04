package websocket

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/jackschu/io_game/pkg/communication"
	pb "github.com/jackschu/io_game/pkg/proto"
	"log"
	"sync/atomic"
)

type Room struct {
	Joining     chan *Client
	Leaving     chan *Client
	Clients     map[*Client]bool
	Broadcast   chan []byte
	Actions     chan *communication.Action
	PlayerCount uint32
	PlayerIDs   chan uint32
}

type Message struct {
	Ball    pb.Ball
	Players map[string]pb.Player
}

func NewRoom() *Room {
	return &Room{
		Joining:     make(chan *Client),
		Leaving:     make(chan *Client),
		Clients:     make(map[*Client]bool),
		Broadcast:   make(chan []byte),
		Actions:     make(chan *communication.Action, 8),
		PlayerCount: 0,
		PlayerIDs:   make(chan uint32, 3),
	}
}

func (room *Room) Start() {
	go room.idCounter()
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
				if err := client.Conn.WriteMessage(websocket.BinaryMessage, message); err != nil {
					log.Println(err)
				}
			}
		}
	}

}

func (room *Room) idCounter() {
	counter := uint32(0)
	for {
		room.PlayerIDs <- counter
		counter += 1
	}
}
