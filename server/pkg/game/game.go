package game

import (
	"encoding/json"
	"github.com/jackschu/io_game/pkg/websocket"
	"log"
	"strconv"
	"time"
)

type GameLoop struct {
	Room    *websocket.Room
	InfoMap map[string]*PlayerInfo
}

func NewGameLoop(room *websocket.Room) *GameLoop {
	return &GameLoop{
		Room:    room,
		InfoMap: make(map[string]*PlayerInfo),
	}
}

func (g *GameLoop) Start() {
	go g.poll()

	prev := time.Now()
	speed := 0.1
	ticker := time.NewTicker(16 * time.Millisecond)
	for {
		select {
		case <-ticker.C:

			cur := time.Now()
			dt := cur.Sub(prev).Seconds() * 1000.0
			prev = cur
			for _, player := range g.InfoMap {
				if player.Direction == 0 {
					player.Ypos -= float64(dt) * speed
				} else if player.Direction == 1 {
					player.Ypos += float64(dt) * speed
				} else if player.Direction == 2 {
					player.Xpos -= float64(dt) * speed
				} else if player.Direction == 3 {
					player.Xpos += float64(dt) * speed
				}
			}
			json_out, err := json.Marshal(g.InfoMap)
			if err != nil {
				log.Println(err)
			} else {
				g.Room.Broadcast <- websocket.Message{Body: string(json_out)}
			}
		}

	}

}

func (g *GameLoop) poll() {
	for {
		action := <-g.Room.Actions
		move := action.Move

		if move == "join" {
			g.InfoMap[action.ID] = NewPlayerInfo(action.ID)
			continue
		}
		if move == "leave" {
			delete(g.InfoMap, action.ID)
			continue
		}
		player := g.InfoMap[action.ID]
		move_int, err := strconv.Atoi(move)
		player.Direction = move_int
		if err != nil {
			log.Println(err)
		}
	}
}
