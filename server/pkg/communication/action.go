package communication

type Action struct {
	ID   uint32
	Move string
}

type SingleMessage struct {
	ID   uint32
	Data []byte
}
