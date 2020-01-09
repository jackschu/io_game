package game

import (
	"math"
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
		MaxSpeed: 14,
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
		botPlayer.Xpos = ball.Xpos
		botPlayer.Ypos = ball.Ypos
	} else {
		xUnit := float32(xDiff / hypot)
		yUnit := float32(yDiff / hypot)

		botPlayer.Xpos += xUnit * bot.MaxSpeed
		botPlayer.Ypos += yUnit * bot.MaxSpeed
	}
}
