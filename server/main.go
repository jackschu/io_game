package main

import (
	"github.com/jackschu/io_game/pkg/websocket"
	"github.com/jackschu/io_game/pkg/metrics"
	"log"
	"net/http"
)

func serveWs(queue *websocket.Queue, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r)
	
	if err != nil {
		log.Println(err)
	}
	// helpful log statement to show connections
	log.Println("Client Connected")
	id := <-queue.PlayerIDs
	client := &websocket.Client{
		ID:    id,
		Conn:  conn,
		Room:  nil,
		Queue: queue,
	}
	queue.AddClient(client)
	client.Read()
}

func setupRoutes() {
	queue := websocket.NewQueue(2, 0)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(queue, w, r)
	})
	http.Handle("/", http.FileServer(http.Dir("../client/dist")))
}

func main() {
	metrics.WebsocketsOpen = 0
	// Enable line numbers in logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8000", nil))
}
