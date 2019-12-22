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
