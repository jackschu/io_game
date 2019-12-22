package game


import (
	"github.com/jackschu/io_game/pkg/websocket"
	"time"
	"log"
	"strconv"
	"encoding/json"
	
)

type GameLoop struct {
	Room *websocket.Room
	InfoMap map[string]*PlayerInfo
}

func NewGameLoop(room *websocket.Room) *GameLoop {
	return  &GameLoop{
		Room: room,
		InfoMap: make(map[string]*PlayerInfo),
	}
}



func (g *GameLoop) Start() {
	go g.poll()
	
	prev := time.Now()
	speed := 0.2
	for {
		cur := time.Now()
		dt := cur.Sub(prev).Milliseconds()
		prev = cur
		for _, player := range g.InfoMap {
			if player.Direction == 0 {
				player.Ypos -= float64(dt)*speed
			} else if player.Direction == 1 {
				player.Ypos += float64(dt)*speed
			} else if player.Direction == 2 {
				player.Xpos -= float64(dt)*speed
			} else if player.Direction == 3 {
				player.Xpos += float64(dt)*speed
			}
		}
		json_out, err := json.Marshal(g.InfoMap)
		if err != nil {
			log.Println(err)
		}else{
			g.Room.Broadcast <- websocket.Message{Body: string(json_out)}
		}
		time.Sleep(time.Duration(500) * time.Millisecond)

	}
	
}


func (g *GameLoop) poll(){
	for {
		action := <- g.Room.Actions
		move := action.Move

		if move == "join" {
			g.InfoMap[action.ID] = NewPlayerInfo(action.ID)
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
