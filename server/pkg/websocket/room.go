package websocket

import (
	"fmt"
	"github.com/gorilla/websocket"
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

func (room *Room) SendMove(client *Client, data []byte) {
	go room.GameLoop.UpdateAction(client.ID, data)
}

func (room *Room) Start() {
	for {
		select {
		case client := <-room.Joining:
			room.Clients[client.ID] = client
			client.SetRoom(room)
			atomic.AddUint32(&room.GameLoop.PlayerCount, 1)
			fmt.Println("Joining, Users in room: ", room.GameLoop.PlayerCount)
			go room.GameLoop.ClientJoin(client.ID)
		case client := <-room.Leaving:
			atomic.AddUint32(&room.GameLoop.PlayerCount, ^uint32(0))
			players := atomic.LoadUint32(&room.GameLoop.PlayerCount)
			fmt.Println("Leaving, Users in room: ", room.GameLoop.PlayerCount)
			if players == 0 {
				return
			}
			delete(room.Clients, client.ID)

			room.GameLoop.ClientLeave(client.ID)
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
