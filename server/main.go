package main

import (
	"flag"
	"github.com/jackschu/io_game/pkg/websocket"
	"log"
	"net/http"
	"os"
	"runtime"
	"runtime/pprof"
	"time"
)

// to profile, go build main.go then ./main -cpuprofile=<anyfilename>
// wait 50 seconds (adjustable) then kill program
// go run tool pprof <anyfilename>
// inside pprof control-d to quit, `web` to view graph, `top10`, `tree` are also useful
var cpuprofile = flag.String("cpuprofile", "", "write cpu profile to file")

func serveWs(queue *websocket.Queue, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r)

	if err != nil {
		log.Println(err)
	}
	// helpful log statement to show connections
	log.Println("Client Connected")
	id := <-queue.PlayerIDs
	client := &websocket.Client{
		ID:    id,
		Conn:  conn,
		Room:  nil,
		Queue: queue,
	}
	queue.AddClient(client)
	client.Read()
}

func setupRoutes() {
	queue := websocket.NewQueue(2)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(queue, w, r)
	})
	http.Handle("/", http.FileServer(http.Dir("../client/dist")))
}

func main() {
	flag.Parse()
	if *cpuprofile != "" {
		f, err := os.Create(*cpuprofile)
		if err != nil {
			log.Fatal(err)
		}
		pprof.StartCPUProfile(f)
	}
	go stopProfile()
	// Enable line numbers in logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func stopProfile() {
	ticker := time.NewTicker(1 * time.Second)
	for i := 0; i < 50; i++ {
		select {
		case <-ticker.C:
			log.Println(runtime.NumGoroutine())
		}
	}
	pprof.StopCPUProfile()
}
