package main

import (
	"github.com/jackschu/io_game/pkg/websocket"
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
	queue := websocket.NewQueue(2)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(queue, w, r)
	})
	http.Handle("/", http.FileServer(http.Dir("../client/dist")))
}

func main() {
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8000", nil))
}
