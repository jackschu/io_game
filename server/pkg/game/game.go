package game

import (
	"encoding/json"
	"github.com/golang/protobuf/proto"
	"github.com/jackschu/io_game/pkg/communication"
	pb "github.com/jackschu/io_game/pkg/proto"
	"github.com/jackschu/io_game/pkg/websocket"
	"log"
	"sync"
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
		Xang: 0,
		Yang: 0,
		Zang: 0,
	}
}

type GameLoop struct {
	Room           *websocket.Room
	InfoMap        map[uint32]*pb.Player
	PlayerMetadata map[uint32]*PlayerMetadata
	Ball           *pb.Ball
	MetaMux        sync.Mutex
}

func NewGameLoop(room *websocket.Room) *GameLoop {
	return &GameLoop{
		Room:           room,
		InfoMap:        make(map[uint32]*pb.Player),
		PlayerMetadata: make(map[uint32]*PlayerMetadata),
		Ball:           NewBallInfo(),
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

func applySpin(ball *pb.Ball) {
	// constant that dampens spin effect
	multiple := float32(0.0002)

	ball.Xvel += (ball.Yang*ball.Zvel - ball.Zang*ball.Yvel) * multiple
	ball.Yvel += (ball.Zang*ball.Xvel - ball.Xang*ball.Zvel) * multiple

	// additional constant for dampening spin affect z-velocity
	// prevents ball from switching directions
	zMultiple := float32(0.05)
	ball.Zvel += (ball.Yang*ball.Xvel - ball.Xang*ball.Yvel) * multiple * zMultiple
}

// reset velocities, including angular velocity
func resetVel(ball *pb.Ball) {
	ball.Xang = 0
	ball.Yang = 0
	ball.Xvel = 0.7
	ball.Yvel = 0.7
	ball.Zvel = 0.7
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
			ball_back := g.Ball.Zpos > 800 && 800+2*ball_radius > g.Ball.Zpos &&
				g.Ball.Zvel > 0

			ball_front := g.Ball.Zpos < 0 && -2*ball_radius < g.Ball.Zpos &&
				g.Ball.Zvel < 0

			if ball_back || ball_front {
				bounce := false
				for id, player := range g.InfoMap {
					playerWall := g.PlayerMetadata[id].WallNum
					if !((playerWall == 0 && ball_front) ||
						(playerWall == 1 && ball_back)) {
						continue
					}
					if playerBallCollide(player, g.Ball) {
						g.Ball.Xang = player.Ylast - player.Ypos
						g.Ball.Yang = player.Xlast - player.Xpos
						bounce = true
						break
					}
				}
				if bounce {
					g.Ball.Zvel *= -1
				} else {
					if ball_back {
						g.Ball.Zpos = 0
					} else if ball_front {
						g.Ball.Zpos = 800
					}
					resetVel(g.Ball)
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

			applySpin(g.Ball)

			g.Ball.Xpos += float32(dt) * g.Ball.Xvel
			g.Ball.Ypos += float32(dt) * g.Ball.Yvel
			g.Ball.Zpos += float32(dt) * g.Ball.Zvel
			data, err := proto.Marshal(&pb.GameState{Ball: g.Ball, Players: g.InfoMap,
				Timestamp: uint64(time.Now().UnixNano() / 1000000)})

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

func (g *GameLoop) getOpenWall() int {
	front_count := 0
	back_count := 0
	for _, data := range g.PlayerMetadata {
		if data.WallNum == 0 {
			front_count++
		} else if data.WallNum == 1 {
			back_count++
		} else {
			log.Println("invalid wall num found")
		}
	}
	if front_count < back_count {
		return 0
	} else {
		return 1
	}
}

func (g *GameLoop) registerMove(action *communication.Action) {
	move := action.Move
	if move == "join" {
		g.InfoMap[action.ID] = NewPlayerInfo()
		g.MetaMux.Lock()
		wall := g.getOpenWall()
		g.PlayerMetadata[action.ID] = &PlayerMetadata{WallNum: wall}
		g.MetaMux.Unlock()
		return
	}
	if move == "leave" {
		delete(g.InfoMap, action.ID)
		return
	}

	if json.Valid([]byte(move)) {
		curPlayer := g.InfoMap[action.ID]
		Xlast := curPlayer.Xpos
		Ylast := curPlayer.Ypos
		json.Unmarshal([]byte(move), curPlayer)
		curPlayer.Xlast = Xlast
		curPlayer.Ylast = Ylast

	} else {
		log.Println("got invalid JSON " + move)

	}

}
