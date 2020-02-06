// Code generated by protoc-gen-go. DO NOT EDIT.
// source: updates.proto

package updates

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

type Wall int32

const (
	Wall_FRONT Wall = 0
	Wall_BACK  Wall = 1
)

var Wall_name = map[int32]string{
	0: "FRONT",
	1: "BACK",
}

var Wall_value = map[string]int32{
	"FRONT": 0,
	"BACK":  1,
}

func (x Wall) String() string {
	return proto.EnumName(Wall_name, int32(x))
}

func (Wall) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{0}
}

type AnyMessage struct {
	// Types that are valid to be assigned to Data:
	//	*AnyMessage_State
	//	*AnyMessage_Start
	//	*AnyMessage_Join
	//	*AnyMessage_Pong
	Data                 isAnyMessage_Data `protobuf_oneof:"data"`
	XXX_NoUnkeyedLiteral struct{}          `json:"-"`
	XXX_unrecognized     []byte            `json:"-"`
	XXX_sizecache        int32             `json:"-"`
}

func (m *AnyMessage) Reset()         { *m = AnyMessage{} }
func (m *AnyMessage) String() string { return proto.CompactTextString(m) }
func (*AnyMessage) ProtoMessage()    {}
func (*AnyMessage) Descriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{0}
}

func (m *AnyMessage) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_AnyMessage.Unmarshal(m, b)
}
func (m *AnyMessage) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_AnyMessage.Marshal(b, m, deterministic)
}
func (m *AnyMessage) XXX_Merge(src proto.Message) {
	xxx_messageInfo_AnyMessage.Merge(m, src)
}
func (m *AnyMessage) XXX_Size() int {
	return xxx_messageInfo_AnyMessage.Size(m)
}
func (m *AnyMessage) XXX_DiscardUnknown() {
	xxx_messageInfo_AnyMessage.DiscardUnknown(m)
}

var xxx_messageInfo_AnyMessage proto.InternalMessageInfo

type isAnyMessage_Data interface {
	isAnyMessage_Data()
}

type AnyMessage_State struct {
	State *GameState `protobuf:"bytes,1,opt,name=state,proto3,oneof"`
}

type AnyMessage_Start struct {
	Start *GameStart `protobuf:"bytes,2,opt,name=start,proto3,oneof"`
}

type AnyMessage_Join struct {
	Join *PlayerJoin `protobuf:"bytes,3,opt,name=join,proto3,oneof"`
}

type AnyMessage_Pong struct {
	Pong *Ping `protobuf:"bytes,4,opt,name=pong,proto3,oneof"`
}

func (*AnyMessage_State) isAnyMessage_Data() {}

func (*AnyMessage_Start) isAnyMessage_Data() {}

func (*AnyMessage_Join) isAnyMessage_Data() {}

func (*AnyMessage_Pong) isAnyMessage_Data() {}

func (m *AnyMessage) GetData() isAnyMessage_Data {
	if m != nil {
		return m.Data
	}
	return nil
}

func (m *AnyMessage) GetState() *GameState {
	if x, ok := m.GetData().(*AnyMessage_State); ok {
		return x.State
	}
	return nil
}

func (m *AnyMessage) GetStart() *GameStart {
	if x, ok := m.GetData().(*AnyMessage_Start); ok {
		return x.Start
	}
	return nil
}

func (m *AnyMessage) GetJoin() *PlayerJoin {
	if x, ok := m.GetData().(*AnyMessage_Join); ok {
		return x.Join
	}
	return nil
}

func (m *AnyMessage) GetPong() *Ping {
	if x, ok := m.GetData().(*AnyMessage_Pong); ok {
		return x.Pong
	}
	return nil
}

// XXX_OneofWrappers is for the internal use of the proto package.
func (*AnyMessage) XXX_OneofWrappers() []interface{} {
	return []interface{}{
		(*AnyMessage_State)(nil),
		(*AnyMessage_Start)(nil),
		(*AnyMessage_Join)(nil),
		(*AnyMessage_Pong)(nil),
	}
}

type GameState struct {
	Ball                 *Ball              `protobuf:"bytes,1,opt,name=ball,proto3" json:"ball,omitempty"`
	Players              map[uint32]*Player `protobuf:"bytes,2,rep,name=players,proto3" json:"players,omitempty" protobuf_key:"varint,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
	Timestamp            uint64             `protobuf:"varint,3,opt,name=timestamp,proto3" json:"timestamp,omitempty"`
	XXX_NoUnkeyedLiteral struct{}           `json:"-"`
	XXX_unrecognized     []byte             `json:"-"`
	XXX_sizecache        int32              `json:"-"`
}

func (m *GameState) Reset()         { *m = GameState{} }
func (m *GameState) String() string { return proto.CompactTextString(m) }
func (*GameState) ProtoMessage()    {}
func (*GameState) Descriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{1}
}

func (m *GameState) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GameState.Unmarshal(m, b)
}
func (m *GameState) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GameState.Marshal(b, m, deterministic)
}
func (m *GameState) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GameState.Merge(m, src)
}
func (m *GameState) XXX_Size() int {
	return xxx_messageInfo_GameState.Size(m)
}
func (m *GameState) XXX_DiscardUnknown() {
	xxx_messageInfo_GameState.DiscardUnknown(m)
}

var xxx_messageInfo_GameState proto.InternalMessageInfo

func (m *GameState) GetBall() *Ball {
	if m != nil {
		return m.Ball
	}
	return nil
}

func (m *GameState) GetPlayers() map[uint32]*Player {
	if m != nil {
		return m.Players
	}
	return nil
}

func (m *GameState) GetTimestamp() uint64 {
	if m != nil {
		return m.Timestamp
	}
	return 0
}

type Player struct {
	Xpos                 float32  `protobuf:"fixed32,1,opt,name=Xpos,proto3" json:"Xpos,omitempty"`
	Ypos                 float32  `protobuf:"fixed32,2,opt,name=Ypos,proto3" json:"Ypos,omitempty"`
	Xlast                float32  `protobuf:"fixed32,3,opt,name=Xlast,proto3" json:"Xlast,omitempty"`
	Ylast                float32  `protobuf:"fixed32,4,opt,name=Ylast,proto3" json:"Ylast,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Player) Reset()         { *m = Player{} }
func (m *Player) String() string { return proto.CompactTextString(m) }
func (*Player) ProtoMessage()    {}
func (*Player) Descriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{2}
}

func (m *Player) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Player.Unmarshal(m, b)
}
func (m *Player) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Player.Marshal(b, m, deterministic)
}
func (m *Player) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Player.Merge(m, src)
}
func (m *Player) XXX_Size() int {
	return xxx_messageInfo_Player.Size(m)
}
func (m *Player) XXX_DiscardUnknown() {
	xxx_messageInfo_Player.DiscardUnknown(m)
}

var xxx_messageInfo_Player proto.InternalMessageInfo

func (m *Player) GetXpos() float32 {
	if m != nil {
		return m.Xpos
	}
	return 0
}

func (m *Player) GetYpos() float32 {
	if m != nil {
		return m.Ypos
	}
	return 0
}

func (m *Player) GetXlast() float32 {
	if m != nil {
		return m.Xlast
	}
	return 0
}

func (m *Player) GetYlast() float32 {
	if m != nil {
		return m.Ylast
	}
	return 0
}

type Ball struct {
	Xpos                 float32  `protobuf:"fixed32,1,opt,name=Xpos,proto3" json:"Xpos,omitempty"`
	Ypos                 float32  `protobuf:"fixed32,2,opt,name=Ypos,proto3" json:"Ypos,omitempty"`
	Zpos                 float32  `protobuf:"fixed32,3,opt,name=Zpos,proto3" json:"Zpos,omitempty"`
	Xvel                 float32  `protobuf:"fixed32,4,opt,name=Xvel,proto3" json:"Xvel,omitempty"`
	Yvel                 float32  `protobuf:"fixed32,5,opt,name=Yvel,proto3" json:"Yvel,omitempty"`
	Zvel                 float32  `protobuf:"fixed32,6,opt,name=Zvel,proto3" json:"Zvel,omitempty"`
	Xang                 float32  `protobuf:"fixed32,7,opt,name=Xang,proto3" json:"Xang,omitempty"`
	Yang                 float32  `protobuf:"fixed32,8,opt,name=Yang,proto3" json:"Yang,omitempty"`
	Zang                 float32  `protobuf:"fixed32,9,opt,name=Zang,proto3" json:"Zang,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Ball) Reset()         { *m = Ball{} }
func (m *Ball) String() string { return proto.CompactTextString(m) }
func (*Ball) ProtoMessage()    {}
func (*Ball) Descriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{3}
}

func (m *Ball) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Ball.Unmarshal(m, b)
}
func (m *Ball) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Ball.Marshal(b, m, deterministic)
}
func (m *Ball) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Ball.Merge(m, src)
}
func (m *Ball) XXX_Size() int {
	return xxx_messageInfo_Ball.Size(m)
}
func (m *Ball) XXX_DiscardUnknown() {
	xxx_messageInfo_Ball.DiscardUnknown(m)
}

var xxx_messageInfo_Ball proto.InternalMessageInfo

func (m *Ball) GetXpos() float32 {
	if m != nil {
		return m.Xpos
	}
	return 0
}

func (m *Ball) GetYpos() float32 {
	if m != nil {
		return m.Ypos
	}
	return 0
}

func (m *Ball) GetZpos() float32 {
	if m != nil {
		return m.Zpos
	}
	return 0
}

func (m *Ball) GetXvel() float32 {
	if m != nil {
		return m.Xvel
	}
	return 0
}

func (m *Ball) GetYvel() float32 {
	if m != nil {
		return m.Yvel
	}
	return 0
}

func (m *Ball) GetZvel() float32 {
	if m != nil {
		return m.Zvel
	}
	return 0
}

func (m *Ball) GetXang() float32 {
	if m != nil {
		return m.Xang
	}
	return 0
}

func (m *Ball) GetYang() float32 {
	if m != nil {
		return m.Yang
	}
	return 0
}

func (m *Ball) GetZang() float32 {
	if m != nil {
		return m.Zang
	}
	return 0
}

type GameStart struct {
	YourID               uint32   `protobuf:"varint,1,opt,name=YourID,proto3" json:"YourID,omitempty"`
	Wall                 Wall     `protobuf:"varint,2,opt,name=wall,proto3,enum=Wall" json:"wall,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GameStart) Reset()         { *m = GameStart{} }
func (m *GameStart) String() string { return proto.CompactTextString(m) }
func (*GameStart) ProtoMessage()    {}
func (*GameStart) Descriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{4}
}

func (m *GameStart) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GameStart.Unmarshal(m, b)
}
func (m *GameStart) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GameStart.Marshal(b, m, deterministic)
}
func (m *GameStart) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GameStart.Merge(m, src)
}
func (m *GameStart) XXX_Size() int {
	return xxx_messageInfo_GameStart.Size(m)
}
func (m *GameStart) XXX_DiscardUnknown() {
	xxx_messageInfo_GameStart.DiscardUnknown(m)
}

var xxx_messageInfo_GameStart proto.InternalMessageInfo

func (m *GameStart) GetYourID() uint32 {
	if m != nil {
		return m.YourID
	}
	return 0
}

func (m *GameStart) GetWall() Wall {
	if m != nil {
		return m.Wall
	}
	return Wall_FRONT
}

type PlayerJoin struct {
	PlayerWalls          map[uint32]Wall `protobuf:"bytes,1,rep,name=playerWalls,proto3" json:"playerWalls,omitempty" protobuf_key:"varint,1,opt,name=key,proto3" protobuf_val:"varint,2,opt,name=value,proto3,enum=Wall"`
	XXX_NoUnkeyedLiteral struct{}        `json:"-"`
	XXX_unrecognized     []byte          `json:"-"`
	XXX_sizecache        int32           `json:"-"`
}

func (m *PlayerJoin) Reset()         { *m = PlayerJoin{} }
func (m *PlayerJoin) String() string { return proto.CompactTextString(m) }
func (*PlayerJoin) ProtoMessage()    {}
func (*PlayerJoin) Descriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{5}
}

func (m *PlayerJoin) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_PlayerJoin.Unmarshal(m, b)
}
func (m *PlayerJoin) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_PlayerJoin.Marshal(b, m, deterministic)
}
func (m *PlayerJoin) XXX_Merge(src proto.Message) {
	xxx_messageInfo_PlayerJoin.Merge(m, src)
}
func (m *PlayerJoin) XXX_Size() int {
	return xxx_messageInfo_PlayerJoin.Size(m)
}
func (m *PlayerJoin) XXX_DiscardUnknown() {
	xxx_messageInfo_PlayerJoin.DiscardUnknown(m)
}

var xxx_messageInfo_PlayerJoin proto.InternalMessageInfo

func (m *PlayerJoin) GetPlayerWalls() map[uint32]Wall {
	if m != nil {
		return m.PlayerWalls
	}
	return nil
}

type Ping struct {
	Timestamp            uint64   `protobuf:"varint,1,opt,name=timestamp,proto3" json:"timestamp,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Ping) Reset()         { *m = Ping{} }
func (m *Ping) String() string { return proto.CompactTextString(m) }
func (*Ping) ProtoMessage()    {}
func (*Ping) Descriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{6}
}

func (m *Ping) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Ping.Unmarshal(m, b)
}
func (m *Ping) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Ping.Marshal(b, m, deterministic)
}
func (m *Ping) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Ping.Merge(m, src)
}
func (m *Ping) XXX_Size() int {
	return xxx_messageInfo_Ping.Size(m)
}
func (m *Ping) XXX_DiscardUnknown() {
	xxx_messageInfo_Ping.DiscardUnknown(m)
}

var xxx_messageInfo_Ping proto.InternalMessageInfo

func (m *Ping) GetTimestamp() uint64 {
	if m != nil {
		return m.Timestamp
	}
	return 0
}

type ClientMessage struct {
	// Types that are valid to be assigned to Data:
	//	*ClientMessage_Player
	//	*ClientMessage_Ping
	Data                 isClientMessage_Data `protobuf_oneof:"data"`
	XXX_NoUnkeyedLiteral struct{}             `json:"-"`
	XXX_unrecognized     []byte               `json:"-"`
	XXX_sizecache        int32                `json:"-"`
}

func (m *ClientMessage) Reset()         { *m = ClientMessage{} }
func (m *ClientMessage) String() string { return proto.CompactTextString(m) }
func (*ClientMessage) ProtoMessage()    {}
func (*ClientMessage) Descriptor() ([]byte, []int) {
	return fileDescriptor_675fc0bf03cd96fd, []int{7}
}

func (m *ClientMessage) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ClientMessage.Unmarshal(m, b)
}
func (m *ClientMessage) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ClientMessage.Marshal(b, m, deterministic)
}
func (m *ClientMessage) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ClientMessage.Merge(m, src)
}
func (m *ClientMessage) XXX_Size() int {
	return xxx_messageInfo_ClientMessage.Size(m)
}
func (m *ClientMessage) XXX_DiscardUnknown() {
	xxx_messageInfo_ClientMessage.DiscardUnknown(m)
}

var xxx_messageInfo_ClientMessage proto.InternalMessageInfo

type isClientMessage_Data interface {
	isClientMessage_Data()
}

type ClientMessage_Player struct {
	Player *Player `protobuf:"bytes,1,opt,name=player,proto3,oneof"`
}

type ClientMessage_Ping struct {
	Ping *Ping `protobuf:"bytes,2,opt,name=ping,proto3,oneof"`
}

func (*ClientMessage_Player) isClientMessage_Data() {}

func (*ClientMessage_Ping) isClientMessage_Data() {}

func (m *ClientMessage) GetData() isClientMessage_Data {
	if m != nil {
		return m.Data
	}
	return nil
}

func (m *ClientMessage) GetPlayer() *Player {
	if x, ok := m.GetData().(*ClientMessage_Player); ok {
		return x.Player
	}
	return nil
}

func (m *ClientMessage) GetPing() *Ping {
	if x, ok := m.GetData().(*ClientMessage_Ping); ok {
		return x.Ping
	}
	return nil
}

// XXX_OneofWrappers is for the internal use of the proto package.
func (*ClientMessage) XXX_OneofWrappers() []interface{} {
	return []interface{}{
		(*ClientMessage_Player)(nil),
		(*ClientMessage_Ping)(nil),
	}
}

func init() {
	proto.RegisterEnum("Wall", Wall_name, Wall_value)
	proto.RegisterType((*AnyMessage)(nil), "AnyMessage")
	proto.RegisterType((*GameState)(nil), "GameState")
	proto.RegisterMapType((map[uint32]*Player)(nil), "GameState.PlayersEntry")
	proto.RegisterType((*Player)(nil), "Player")
	proto.RegisterType((*Ball)(nil), "Ball")
	proto.RegisterType((*GameStart)(nil), "GameStart")
	proto.RegisterType((*PlayerJoin)(nil), "PlayerJoin")
	proto.RegisterMapType((map[uint32]Wall)(nil), "PlayerJoin.PlayerWallsEntry")
	proto.RegisterType((*Ping)(nil), "Ping")
	proto.RegisterType((*ClientMessage)(nil), "ClientMessage")
}

func init() { proto.RegisterFile("updates.proto", fileDescriptor_675fc0bf03cd96fd) }

var fileDescriptor_675fc0bf03cd96fd = []byte{
	// 523 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x8c, 0x93, 0xc1, 0x6e, 0xd3, 0x40,
	0x10, 0x86, 0x63, 0x67, 0xed, 0x34, 0x13, 0x82, 0xa2, 0x15, 0x02, 0xd3, 0x14, 0xa9, 0xb5, 0x38,
	0x54, 0x1c, 0x2c, 0x11, 0x2e, 0x88, 0x43, 0xa5, 0x26, 0x14, 0x02, 0x08, 0xa8, 0x0c, 0x52, 0x93,
	0x88, 0xcb, 0x56, 0x5d, 0x59, 0x06, 0x67, 0x6d, 0xd9, 0x9b, 0xa2, 0x3c, 0x07, 0x57, 0x9e, 0x04,
	0xf1, 0x70, 0x68, 0xc6, 0x93, 0xc4, 0xad, 0x38, 0xf4, 0x36, 0xfe, 0x66, 0xfe, 0xdd, 0xf1, 0xce,
	0x3f, 0xd0, 0x5f, 0x15, 0x57, 0xca, 0xea, 0x2a, 0x2a, 0xca, 0xdc, 0xe6, 0xe1, 0x6f, 0x07, 0xe0,
	0xd4, 0xac, 0x3f, 0xea, 0xaa, 0x52, 0x89, 0x96, 0x21, 0x78, 0x95, 0x55, 0x56, 0x07, 0xce, 0xa1,
	0x73, 0xdc, 0x1b, 0x41, 0xf4, 0x56, 0x2d, 0xf5, 0x17, 0x24, 0xd3, 0x56, 0x5c, 0xa7, 0xb8, 0xa6,
	0xb4, 0x81, 0x7b, 0xb3, 0xa6, 0xb4, 0x5c, 0x53, 0x5a, 0x79, 0x04, 0xe2, 0x7b, 0x9e, 0x9a, 0xa0,
	0x4d, 0x25, 0xbd, 0xe8, 0x3c, 0x53, 0x6b, 0x5d, 0xbe, 0xcf, 0x53, 0x33, 0x6d, 0xc5, 0x94, 0x92,
	0x43, 0x10, 0x45, 0x6e, 0x92, 0x40, 0x50, 0x89, 0x17, 0x9d, 0xa7, 0x26, 0xc1, 0x24, 0xc2, 0xb1,
	0x0f, 0xe2, 0x4a, 0x59, 0x15, 0xfe, 0x75, 0xa0, 0xbb, 0x6d, 0x41, 0x3e, 0x06, 0x71, 0xa9, 0xb2,
	0x8c, 0x9b, 0xf3, 0xa2, 0xb1, 0xca, 0xb2, 0x98, 0x90, 0x7c, 0x0e, 0x9d, 0x82, 0xee, 0xa8, 0x02,
	0xf7, 0xb0, 0x7d, 0xdc, 0x1b, 0x3d, 0xda, 0xb5, 0xce, 0xb7, 0x57, 0x67, 0xc6, 0x96, 0xeb, 0x78,
	0x53, 0x27, 0x0f, 0xa0, 0x6b, 0xd3, 0xa5, 0xae, 0xac, 0x5a, 0x16, 0xd4, 0xa8, 0x88, 0x77, 0x60,
	0x7f, 0x02, 0xf7, 0x9a, 0x32, 0x39, 0x80, 0xf6, 0x0f, 0xbd, 0xa6, 0xab, 0xfb, 0x31, 0x86, 0xf2,
	0x09, 0x78, 0xd7, 0x2a, 0x5b, 0x69, 0x7e, 0x87, 0x0e, 0x5f, 0x13, 0xd7, 0xf4, 0x95, 0xfb, 0xd2,
	0x09, 0xbf, 0x81, 0x5f, 0x43, 0x29, 0x41, 0xcc, 0x8a, 0xbc, 0x22, 0xbd, 0x1b, 0x53, 0x8c, 0x6c,
	0x8e, 0xcc, 0xad, 0x19, 0xc6, 0xf2, 0x01, 0x78, 0xb3, 0x4c, 0x55, 0x96, 0x1a, 0x72, 0xe3, 0xfa,
	0x03, 0xe9, 0x9c, 0xa8, 0xa8, 0x29, 0x7d, 0x84, 0x7f, 0x1c, 0x10, 0xf8, 0x04, 0x77, 0x3e, 0x5c,
	0x82, 0x58, 0x20, 0xab, 0xcf, 0xa6, 0x98, 0xb4, 0xd7, 0x3a, 0xe3, 0x93, 0x29, 0x26, 0x2d, 0x32,
	0x8f, 0xb5, 0xcc, 0x16, 0xc8, 0x7c, 0xd6, 0x32, 0x9b, 0x29, 0x93, 0x04, 0x1d, 0xd6, 0x2a, 0x93,
	0x90, 0x16, 0xd9, 0x1e, 0x6b, 0x99, 0x2d, 0x90, 0x75, 0x59, 0xab, 0x4c, 0x12, 0x9e, 0x6c, 0x07,
	0x5b, 0x5a, 0xf9, 0x10, 0xfc, 0x79, 0xbe, 0x2a, 0xdf, 0xbd, 0xe6, 0xf7, 0xe5, 0x2f, 0x1c, 0xf8,
	0x4f, 0x1c, 0x38, 0xfe, 0xc4, 0xfd, 0x91, 0x17, 0x5d, 0xd0, 0xc0, 0x11, 0x85, 0xbf, 0x1c, 0x80,
	0x9d, 0xab, 0xe4, 0x09, 0xf4, 0xea, 0xb9, 0x62, 0x09, 0xbe, 0x04, 0x7a, 0xe0, 0xa0, 0xe1, 0x3b,
	0x0e, 0x29, 0x5d, 0x1b, 0xa1, 0x29, 0xd8, 0x3f, 0x83, 0xc1, 0xed, 0x82, 0xff, 0x8c, 0x7c, 0xd8,
	0x1c, 0xf9, 0xb6, 0xa1, 0xc6, 0xc0, 0x9f, 0x82, 0x40, 0x1f, 0xdf, 0xf4, 0x96, 0x73, 0xcb, 0x5b,
	0xe1, 0x05, 0xf4, 0x27, 0x59, 0xaa, 0x8d, 0xdd, 0xac, 0xdd, 0x11, 0xf8, 0x75, 0x33, 0x6c, 0xed,
	0x8d, 0x97, 0xa6, 0xad, 0x98, 0x13, 0xb4, 0x2e, 0xa9, 0x49, 0xd8, 0x6c, 0x8d, 0x75, 0x49, 0x77,
	0xeb, 0xf2, 0x6c, 0x08, 0x02, 0x3b, 0x92, 0x5d, 0xf0, 0xde, 0xc4, 0x9f, 0x3f, 0x7d, 0x1d, 0xb4,
	0xe4, 0x1e, 0x88, 0xf1, 0xe9, 0xe4, 0xc3, 0xc0, 0xb9, 0xf4, 0x69, 0xe3, 0x5f, 0xfc, 0x0b, 0x00,
	0x00, 0xff, 0xff, 0xb7, 0xd5, 0x37, 0x18, 0x02, 0x04, 0x00, 0x00,
}
