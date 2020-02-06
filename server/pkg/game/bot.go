package game

import (
	"math"
	"math/rand"
)

type Bot struct {
	ID       uint32
	Game     *GameLoop
	MaxSpeed float32
}

func NewBot(id uint32, game *GameLoop) *Bot {
	newBot := &Bot{
		ID:       id,
		Game:     game,
		MaxSpeed: 140, //@nocommit change to 14
	}
	game.AddBot(newBot)
	return newBot
}

func (bot *Bot) Act() {
	botPlayer := bot.Game.InfoMap[bot.ID]
	ball := bot.Game.Ball

	botPlayer.Xlast = botPlayer.Xpos
	botPlayer.Ylast = botPlayer.Ypos

	xDiff := float64(ball.Xpos - botPlayer.Xpos)
	yDiff := float64(ball.Ypos - botPlayer.Ypos)
	hypot := math.Hypot(xDiff, yDiff)

	if float32(hypot) <= bot.MaxSpeed {
		botPlayer.Xpos = ball.Xpos + float32(rand.Intn(50)-25)
		botPlayer.Ypos = ball.Ypos + float32(rand.Intn(50)-25)
	} else {
		xUnit := float32(xDiff / hypot)
		yUnit := float32(yDiff / hypot)

		botPlayer.Xpos += xUnit*bot.MaxSpeed*rand.Float32() + float32(rand.Intn(50)-25)
		botPlayer.Ypos += yUnit*bot.MaxSpeed*rand.Float32() + float32(rand.Intn(50)-25)
	}
}
