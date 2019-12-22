package websocket

import "fmt"

type Room struct {
	Joining   chan *Client
	Leaving   chan *Client
	Clients   map[*Client]bool
	Broadcast chan Message
}

func NewRoom() *Room {
	return &Room{
		Joining:   make(chan *Client),
		Leaving:   make(chan *Client),
		Clients:   make(map[*Client]bool),
		Broadcast: make(chan Message),
	}
}

func (room *Room) Start() {
	for {
		select {
		case client := <-room.Joining:
			room.Clients[client] = true
			fmt.Println("Joining, Users in room: ", len(room.Clients))
			break
		case client := <-room.Leaving:
			delete(room.Clients, client)
			fmt.Println("Leaving, Users in room: ", len(room.Clients))
			break
		case message := <-room.Broadcast:
			fmt.Println("Sending message to all clients in Room")
			for client, _ := range room.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
