package main

import (
	"github.com/jackschu/io_game/pkg/websocket"
	"github.com/lithammer/shortuuid/v3"

	"github.com/jackschu/io_game/pkg/game"
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

	client := &websocket.Client{
		ID:   shortuuid.New(),
		Conn: conn,
		Room: room,
	}
	room.Joining <- client
	client.Read()
}

func setupRoutes() {
	room := websocket.NewRoom()
	go room.Start()
	game := game.NewGameLoop(room)
	go game.Start()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(room, w, r)
	})
	http.Handle("/", http.FileServer(http.Dir("../client/dist")))
}

func main() {
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8000", nil))
}
