package websocket

import (
	"github.com/jackschu/io_game/pkg/game"
	"sync"
)

type Queue struct {
	clients   []*Client
	clientSet map[*Client]bool
	roomSize  int
	numBots   int
	PlayerIDs chan uint32
	mux       *sync.Mutex
}

func NewQueue(roomSize, numBots int) *Queue {
	newQueue := &Queue{
		clients:   make([]*Client, 0),
		clientSet: make(map[*Client]bool),
		roomSize:  roomSize,
		numBots:   numBots,
		PlayerIDs: make(chan uint32, 3),
		mux:       &sync.Mutex{},
	}
	go newQueue.idCounter()
	return newQueue
}

func (queue *Queue) AddClient(client *Client) {
	queue.mux.Lock()
	defer queue.mux.Unlock()
	if queue.clientSet[client] {
		return
	}
	queue.clients = append(queue.clients, client)
	queue.clientSet[client] = true

	if len(queue.clients) >= queue.roomSize {
		queue.Delegate()
	}
}

func (queue *Queue) RemoveClient(client *Client) {
	queue.mux.Lock()
	defer queue.mux.Unlock()
	if !queue.clientSet[client] {
		return
	}

	delete(queue.clientSet, client)

	for i, c := range queue.clients {
		if client == c {
			queue.clients = append(queue.clients[:i], queue.clients[i+1:]...)
			break
		}
	}
}

func (queue *Queue) Delegate() {
	gameLoop := game.NewGameLoop()
	room := NewRoom(gameLoop)
	go room.Start()

	bots := make([]*game.Bot, queue.numBots)
	for i, _ := range bots {
		bots[i] = game.NewBot(<-queue.PlayerIDs, gameLoop)
	}

	for i := 0; i < queue.roomSize; i++ {
		curClient := queue.clients[0]
		room.Joining <- curClient
		queue.clients = queue.clients[1:]
		delete(queue.clientSet, curClient)
	}

	go gameLoop.Start()
}

func (queue *Queue) idCounter() {
	counter := uint32(0)
	for {
		queue.PlayerIDs <- counter
		counter += 1
	}
}
