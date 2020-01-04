package websocket

import (
	"github.com/jackschu/io_game/pkg/game"
	"sync"
	"time"
)

type Queue struct {
	clients   []*Client
	clientSet map[*Client]bool
	roomSize  int
	PlayerIDs chan uint32
	mux       *sync.Mutex
}

func NewQueue(roomSize int) *Queue {
	return &Queue{
		clients:   make([]*Client, 0),
		clientSet: make(map[*Client]bool),
		roomSize:  roomSize,
		PlayerIDs: make(chan uint32, 3),
		mux:       &sync.Mutex{},
	}
}

func (queue *Queue) AddClient(client *Client) {
	queue.mux.Lock()
	defer queue.mux.Unlock()
	if queue.clientSet[client] {
		return
	}
	queue.clients = append(queue.clients, client)
	queue.clientSet[client] = true
}

func (queue *Queue) RemoveClient(client *Client) {
	queue.mux.Lock()
	defer queue.mux.Unlock()
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
	go queue.idCounter()
	ticker := time.NewTicker(16 * time.Millisecond)
	for {
		select {
		case <-ticker.C:
			queue.mux.Lock()
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
			queue.mux.Unlock()
		}
	}
}

func (queue *Queue) idCounter() {
	counter := uint32(0)
	for {
		queue.PlayerIDs <- counter
		counter += 1
	}
}
