package game

type PlayerInfo struct {
	Xpos      float64
	Ypos      float64
	Direction int
}

func NewPlayerInfo(id string) *PlayerInfo {
	return &PlayerInfo{
		Xpos:      200,
		Ypos:      200,
		Direction: 0,
	}
}
