package game

import (
	pb "github.com/jackschu/io_game/pkg/proto"
)

func NewPlayerInfo(pct int) *pb.Player {
	var wall pb.Player_Wall
	if pct%2 == 1 {
		wall = pb.Player_FRONT
	} else {
		wall = pb.Player_BACK
	}
	return &pb.Player{
		Xpos: 200,
		Ypos: 200,
		Wall: wall,
	}
}
