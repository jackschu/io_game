package game

type Bot struct {
	ID   uint32
	Game *GameLoop
}

func (bot *Bot) Act() {
	botPlayer := bot.Game.InfoMap[bot.ID]
	ball := bot.Game.Ball

	botPlayer.Xlast = botPlayer.Xpos
	botPlayer.Ylast = botPlayer.Ypos
	botPlayer.Xpos = ball.Xpos
	botPlayer.Ypos = ball.Ypos
}
