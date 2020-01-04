package game

import (
	pb "github.com/jackschu/io_game/pkg/proto"
)

type PlayerMetadata struct {
	WallNum int
}

func NewPlayerInfo() *pb.Player {
	return &pb.Player{
		Xpos:  200,
		Ypos:  200,
		Xlast: 200,
		Ylast: 200,
	}
}
