package game

import (
	"encoding/json"
	"github.com/golang/protobuf/proto"
	"github.com/jackschu/io_game/pkg/communication"
	pb "github.com/jackschu/io_game/pkg/proto"
	"github.com/jackschu/io_game/pkg/websocket"
	"log"
	"sync/atomic"
	"time"
)

// TODO replace cwith constant vars
func NewBallInfo() *pb.Ball {
	return &pb.Ball{
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
	InfoMap map[string]*pb.Player
	Ball    *pb.Ball
}

func NewGameLoop(room *websocket.Room) *GameLoop {
	return &GameLoop{
		Room:    room,
		InfoMap: make(map[string]*pb.Player),
		Ball:    NewBallInfo(),
	}
}

func max(x, y float32) float32 {
	if x > y {
		return x
	}
	return y
}

func min(x, y float32) float32 {
	if x > y {
		return y
	}
	return x
}

func playerBallCollide(player *pb.Player, ball *pb.Ball) bool {
	// TODO replace player size with consts
	player_size := float32(200.0)
	circle_radius := float32(50.0)

	rectX := player.Xpos - player_size/2
	rectY := player.Ypos - player_size/2

	deltaX := ball.Xpos - max(rectX, min(ball.Xpos, rectX+player_size))
	deltaY := ball.Ypos - max(rectY, min(ball.Ypos, rectY+player_size))
	return (deltaX*deltaX + deltaY*deltaY) < (circle_radius * circle_radius)
}

func (g *GameLoop) Start() {
	prev := time.Now()
	ticker := time.NewTicker(16 * time.Millisecond)
	for {
		select {
		case <-ticker.C:
			cur := time.Now()
			dt := cur.Sub(prev).Seconds() * 1000.0
			prev = cur

			// TODO replace hardd coded walls withshared consts
			ball_radius := float32(50)
			if g.Ball.Zpos > 800 && g.Ball.Zvel > 0 {
				g.Ball.Zvel *= -1
			} else if g.Ball.Zpos < 0 && -2*ball_radius < g.Ball.Zpos && g.Ball.Zvel < 0 {
				bounce := false
				for _, player := range g.InfoMap {
					if playerBallCollide(player, g.Ball) {
						bounce = true
						break
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

			g.Ball.Xpos += float32(dt) * g.Ball.Xvel
			g.Ball.Ypos += float32(dt) * g.Ball.Yvel
			g.Ball.Zpos += float32(dt) * g.Ball.Zvel
			data, err := proto.Marshal(&pb.GameState{Ball: g.Ball, Players: g.InfoMap, Timestamp: uint64(time.Now().UnixNano() / 1000000)})
			if err != nil {
				log.Fatal("marshaling error: ", err)
			}

			g.Room.Broadcast <- data

			for i := 0; i < int(atomic.LoadUint32(&g.Room.PlayerCount))+2; i++ {
				select {
				case action := <-g.Room.Actions:
					g.registerMove(action)
				default:
					break
				}
			}
		}

	}

}

func (g *GameLoop) registerMove(action *communication.Action) {
	move := action.Move
	if move == "join" {
		pct := int(atomic.LoadUint32(&g.Room.PlayerCount))
		g.InfoMap[action.ID] = NewPlayerInfo(pct)

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
