package websocket

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/jackschu/io_game/pkg/communication"
	"github.com/jackschu/io_game/pkg/game"
	pb "github.com/jackschu/io_game/pkg/proto"
	"log"
	"sync/atomic"
)

type Room struct {
	GameLoop *game.GameLoop
	Joining  chan *Client
	Leaving  chan *Client
	Clients  map[uint32]*Client
}

type Message struct {
	Ball    pb.Ball
	Players map[string]pb.Player
}

func NewRoom(gameLoop *game.GameLoop) *Room {
	return &Room{
		GameLoop: gameLoop,
		Joining:  make(chan *Client),
		Leaving:  make(chan *Client),
		Clients:  make(map[uint32]*Client),
	}
}

func (room *Room) Start() {
	defer close(room.GameLoop.Actions)
	for {
		select {
		case client := <-room.Joining:
			room.Clients[client.ID] = client
			client.SetRoom(room)
			atomic.AddUint32(&room.GameLoop.PlayerCount, 1)
			fmt.Println("Joining, Users in room: ", room.GameLoop.PlayerCount)

			select {
			case room.GameLoop.Actions <- &communication.Action{ID: client.ID, Move: "join"}:
			default:
				log.Println("full join")
			}
			break
		case client := <-room.Leaving:
			atomic.AddUint32(&room.GameLoop.PlayerCount, ^uint32(0))
			players := atomic.LoadUint32(&room.GameLoop.PlayerCount)
			if players == 0 {
				return
			}
			delete(room.Clients, client.ID)
			fmt.Println("Leaving, Users in room: ", room.GameLoop.PlayerCount)
			room.GameLoop.Actions <- &communication.Action{ID: client.ID, Move: "leave"}
			break
		case message := <-room.GameLoop.Broadcast:
			for _, client := range room.Clients {
				if err := client.Conn.WriteMessage(websocket.BinaryMessage, message); err != nil {
					log.Println(err)
				}
			}
		case update := <-room.GameLoop.Updates:
			client, present := room.Clients[update.ID]
			if !present {
				log.Println("Update to ", update.ID, " failed, missing client")
				break
			}
			if err := client.Conn.
				WriteMessage(websocket.BinaryMessage, update.Data); err != nil {
				log.Println(err)
				break
			}
		}

	}

}
