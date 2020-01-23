package main

import (
	"github.com/jackschu/io_game/pkg/communication"
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
		ID:        id,
		Conn:      conn,
		Room:      nil,
		Queue:     queue,
		WriteChan: make(chan communication.WriteMessage),
	}
	queue.AddClient(client)
	go client.Write()
	client.Read()

}


func setupRoutes() {
	queue := websocket.NewQueue(1, 1)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(queue, w, r)
	})
	http.Handle("/", http.FileServer(http.Dir("../client/dist")))
}

func main() {
	// Enable line numbers in logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8000", nil))
}
