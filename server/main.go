package main

import (
	"github.com/jackschu/io_game/pkg/game"
	"github.com/jackschu/io_game/pkg/websocket"
	"log"
	"net/http"
)

func serveWs(room *websocket.Room, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r)

	if err != nil {
		log.Println(err)
	}
	// helpful log statement to show connections
	log.Println("Client Connected")
	id := <-room.PlayerIDs
	client := &websocket.Client{
		ID:   id,
		Conn: conn,
		Room: room,
	}
	room.Joining <- client
	client.Read()
}

func setupRoutes() {
	game := game.NewGameLoop()
	go game.Start()
	room := websocket.NewRoom(game)
	go room.Start()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(room, w, r)
	})
	http.Handle("/", http.FileServer(http.Dir("../client/dist")))
}

func main() {
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8000", nil))
}
