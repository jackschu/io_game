package game

import (
	"github.com/golang/protobuf/proto"
	"github.com/jackschu/io_game/pkg/communication"
	pb "github.com/jackschu/io_game/pkg/proto"
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
		Xvel: 0.0,
		Yvel: 0.0,
		Zvel: 0.7,
		Xang: 0,
		Yang: 0,
		Zang: 0,
	}
}

type GameLoop struct {
	Actions        map[uint32]*communication.Action
	Updates        chan *communication.SingleMessage
	PlayerCount    uint32
	Bots           []*Bot
	Broadcast      chan []byte
	InfoMap        map[uint32]*pb.Player
	Ball           *pb.Ball
	PlayerMetadata map[uint32]*PlayerMetadata
	ClientsMutex   sync.Mutex
	ActionsMutex   sync.Mutex
}

func NewGameLoop() *GameLoop {
	return &GameLoop{
		Broadcast:      make(chan []byte, 8),
		Actions:        make(map[uint32]*communication.Action),
		Updates:        make(chan *communication.SingleMessage, 2),
		PlayerCount:    0,
		Bots:           nil,
		InfoMap:        make(map[uint32]*pb.Player),
		Ball:           NewBallInfo(),
		PlayerMetadata: make(map[uint32]*PlayerMetadata),
	}
}

func (g *GameLoop) AddBot(bot *Bot) {
	g.Bots = append(g.Bots, bot)
	g.addPlayer(bot.ID)
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

// reset velocities and positions, including angular velocity
func resetBall(ball *pb.Ball) {
	ball.Xpos = 750
	ball.Ypos = 500
	ball.Xang = 0
	ball.Yang = 0
	ball.Xvel = 0.0
	ball.Yvel = 0.0
	ball.Zvel = 0.7
}

func (g *GameLoop) Start() {
	prev := time.Now()
	ticker := time.NewTicker(16 * time.Millisecond)
	defer ticker.Stop()
	for {
		if atomic.LoadUint32(&g.PlayerCount) == 0 {
			return
		}
		select {
		case <-ticker.C:
			g.ClientsMutex.Lock()
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
						spinMultiple := float32(1.0)
						if playerWall == 1 {
							spinMultiple = -1
						}

						g.Ball.Xang += (player.Ylast - player.Ypos) * spinMultiple
						g.Ball.Yang += (player.Xlast - player.Xpos) * spinMultiple
						bounce = true
						break
					}
				}
				if bounce {
					g.Ball.Zvel *= -1
				} else {
					resetBall(g.Ball)
					if ball_back {
						g.Ball.Zpos = 0
					} else if ball_front {
						g.Ball.Zpos = 800
						g.Ball.Zvel *= -1
					}
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

			for _, bot := range g.Bots {
				bot.Act()
			}

			data, err := proto.Marshal(&pb.AnyMessage{Data: &pb.AnyMessage_State{State: &pb.GameState{Ball: g.Ball, Players: g.InfoMap,
				Timestamp: uint64(time.Now().UnixNano() / 1000000)}}})

			if err != nil {
				log.Fatal("marshaling error: ", err)
			}
			select {
			case g.Broadcast <- data:
			default:
				log.Println("full broadcast", atomic.LoadUint32(&g.PlayerCount))
			}

			g.ActionsMutex.Lock()
			for id, action := range g.Actions {
				curPlayer, ok := g.InfoMap[id]
				if !ok {
					continue
				}
				Xlast := curPlayer.Xpos
				Ylast := curPlayer.Ypos
				proto.UnmarshalMerge(action.Data, curPlayer)
				curPlayer.Xlast = Xlast
				curPlayer.Ylast = Ylast
			}
			g.Actions = make(map[uint32]*communication.Action)
			g.ActionsMutex.Unlock()

			g.ClientsMutex.Unlock()
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

func (g *GameLoop) addPlayer(id uint32) int {
	g.ClientsMutex.Lock()
	g.InfoMap[id] = NewPlayerInfo()
	wall := g.getOpenWall()
	g.PlayerMetadata[id] = &PlayerMetadata{WallNum: wall}
	wall_map := make(map[uint32]pb.Wall)
	for id, metadata := range g.PlayerMetadata {
		wall_map[id] = pb.Wall(metadata.WallNum)
	}
	g.ClientsMutex.Unlock()

	data, err := proto.Marshal(&pb.AnyMessage{Data: &pb.AnyMessage_Join{Join: &pb.PlayerJoin{PlayerWalls: wall_map}}})
	if err != nil {
		log.Fatal("join broadcast marshaling error: ", err)
	}

	g.Broadcast <- data
	return wall
}

func (g *GameLoop) ClientJoin(id uint32) {
	wall := g.addPlayer(id)
	data, err := proto.Marshal(&pb.AnyMessage{Data: &pb.AnyMessage_Start{Start: &pb.GameStart{YourID: id, Wall: pb.Wall(wall)}}})
	if err != nil {
		log.Fatal("join marshaling error: ", err)
	}

	g.Updates <- &communication.SingleMessage{ID: id, Data: data}
}

func (g *GameLoop) ClientLeave(id uint32) {
	g.ClientsMutex.Lock()
	delete(g.InfoMap, id)
	delete(g.PlayerMetadata, id)
	g.ClientsMutex.Unlock()

	g.ActionsMutex.Lock()
	delete(g.Actions, id)
	g.ActionsMutex.Unlock()
}

func (g *GameLoop) UpdateAction(id uint32, data []byte) {
	g.ActionsMutex.Lock()
	g.Actions[id] = &communication.Action{ID: id, Move: "move", Data: data}
	g.ActionsMutex.Unlock()
}
