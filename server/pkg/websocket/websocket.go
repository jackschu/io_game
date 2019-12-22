package websocket

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

type Player struct {
	Xpos int
	Ypos int
}

func (p *Player) toString() string {
	return fmt.Sprintf("(%d, %d)", p.Xpos, p.Ypos)
}

var player = &Player{200, 200}

// We'll need to define an Upgrader
// this will require a Read and Write buffer size
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return ws, err
	}
	return ws, nil
}

// define a reader which will listen for
// new messages being sent to our WebSocket
// endpoint
func Reader(conn *websocket.Conn) {
	for {
		// read in a message
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// print out that message for clarity
		//fmt.Println(string(p))

		if string(p) == "0" {
			player.Ypos -= 1
		} else if string(p) == "1" {
			player.Ypos += 1
		} else if string(p) == "2" {
			player.Xpos -= 1
		} else if string(p) == "3" {
			player.Xpos += 1
		}

		if err := conn.WriteJSON(*player); err != nil {
			log.Println(err)
			return
		}
	}
}
