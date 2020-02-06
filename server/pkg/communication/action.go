package communication

type Action struct {
	ID   uint32
	Move string
	Data []byte
}

type SingleMessage struct {
	ID   uint32
	Data []byte
}

type WriteMessage struct {
	MessageType int
	Message     []byte
}
