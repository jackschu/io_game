package websocket

import (
	"github.com/jackschu/io_game/pkg/game"
	"time"
)

type Queue struct {
	clients   []*Client
	clientSet map[*Client]bool
	roomSize  int
}

func NewQueue(roomSize int) *Queue {
	return &Queue{
		clients:   make([]*Client, 0),
		clientSet: make(map[*Client]bool),
		roomSize:  roomSize,
	}
}

func (queue *Queue) AddClient(client *Client) {
	if queue.clientSet[client] {
		return
	}
	queue.clients = append(queue.clients, client)
	queue.clientSet[client] = true
}

func (queue *Queue) RemoveClient(client *Client) {
	if !queue.clientSet[client] {
		return
	}

	delete(queue.clientSet, client)

	if client.Room != nil {
		client.Room.Leaving <- client
		return
	}
	for i, c := range queue.clients {
		if client == c {
			queue.clients = append(queue.clients[:i], queue.clients[i+1:]...)
			break
		}
	}
}

func (queue *Queue) Delegate() {
	ticker := time.NewTicker(16 * time.Millisecond)
	for {
		select {
		case <-ticker.C:
			if len(queue.clients) >= queue.roomSize {
				game := game.NewGameLoop()
				room := NewRoom(game)
				go room.Start()

				for i := 0; i < queue.roomSize; i++ {
					curClient := queue.clients[0]
					curClient.Room = room
					room.Joining <- curClient
					queue.clients = queue.clients[1:]
				}

				go game.Start()
			}
		}
	}
}
