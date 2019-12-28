package game

import (
	"encoding/json"
	"github.com/jackschu/io_game/pkg/communication"
	"github.com/jackschu/io_game/pkg/websocket"
	"log"
	"math"
	"time"
)

type BallInfo struct {
	Xpos float64
	Ypos float64
	Zpos float64
	Xvel float64
	Yvel float64
	Zvel float64
}

// TODO replace cwith constant vars
func NewBallInfo() *BallInfo {
	return &BallInfo{
		Xpos: 750,
		Ypos: 500,
		Zpos: 0,
		Xvel: 0.7,
		Yvel: 0.7,
		Zvel: 0.7,
	}
}

type GameLoop struct {
	Room    *websocket.Room
	InfoMap map[string]*PlayerInfo
	Ball    *BallInfo
}

func NewGameLoop(room *websocket.Room) *GameLoop {
	return &GameLoop{
		Room:    room,
		InfoMap: make(map[string]*PlayerInfo),
		Ball:    NewBallInfo(),
	}
}

func playerBallCollide(player *PlayerInfo, ball *BallInfo) bool {
	// TODO replace player size with consts
	player_size := 200.0
	circle_radius := 50.0

	rectX := player.Xpos - player_size/2
	rectY := player.Ypos - player_size/2

	deltaX := ball.Xpos - math.Max(rectX, math.Min(ball.Xpos, rectX+player_size))
	deltaY := ball.Ypos - math.Max(rectY, math.Min(ball.Ypos, rectY+player_size))
	return (deltaX*deltaX + deltaY*deltaY) < (circle_radius * circle_radius)
}

func (g *GameLoop) Start() {
	go g.poll()

	prev := time.Now()
	ticker := time.NewTicker(16 * time.Millisecond)
	for {
		select {
		case <-ticker.C:
			cur := time.Now()
			dt := cur.Sub(prev).Seconds() * 1000.0
			prev = cur

			// TODO replace hardd coded walls withshared consts
			ball_radius := float64(50)
			if g.Ball.Zpos > 800 && g.Ball.Zvel > 0 {
				g.Ball.Zvel *= -1
			} else if g.Ball.Zpos < 0 && -2*ball_radius < g.Ball.Zpos && g.Ball.Zvel < 0 {
				bounce := false
				for _, player := range g.InfoMap {
					if(playerBallCollide(player, g.Ball)){
						bounce = true
						break;
					}
				}
				if bounce {
					g.Ball.Zvel *= -1
				} else {
					g.Ball.Zpos = 800
				}
			}

			if g.Ball.Xpos > 1500-ball_radius && g.Ball.Xvel > 0 {
				g.Ball.Xvel *= -1
			} else if g.Ball.Xpos < 0+ball_radius && g.Ball.Xvel < 0 {
				g.Ball.Xvel *= -1
			}

			if g.Ball.Ypos > 1000-ball_radius && g.Ball.Yvel > 0 {
				g.Ball.Yvel *= -1
			} else if g.Ball.Ypos < 0+ball_radius && g.Ball.Yvel < 0 {
				g.Ball.Yvel *= -1
			}

			g.Ball.Xpos += float64(dt) * g.Ball.Xvel
			g.Ball.Ypos += float64(dt) * g.Ball.Yvel
			g.Ball.Zpos += float64(dt) * g.Ball.Zvel
			players_bytes, err := json.Marshal(g.InfoMap)
			if err != nil {
				log.Println(err)
			}
			ball_bytes, err := json.Marshal(g.Ball)
			if err != nil {
				log.Println(err)
			}
			pre_json_out := map[string]string{
				"players": string(players_bytes),
				"ball":    string(ball_bytes),
			}

			json_out, err := json.Marshal(pre_json_out)
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
		go g.registerMove(action)
	}
}

func (g *GameLoop) registerMove(action *communication.Action) {
	move := action.Move
	if move == "join" {
		g.InfoMap[action.ID] = NewPlayerInfo(action.ID)
		return
	}
	if move == "leave" {
		delete(g.InfoMap, action.ID)
		return
	}

	if json.Valid([]byte(move)) {
		json.Unmarshal([]byte(move), g.InfoMap[action.ID])

	} else {
		log.Println("got invalid JSON " + move)

	}

}
