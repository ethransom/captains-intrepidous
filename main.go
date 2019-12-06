package main

import (
	"flag"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var addr = flag.String("addr", "localhost:8080", "http service address")

// Game represents the connections, and eventually state, of a game
type Game struct {
	mu      sync.Mutex
	clients []*websocket.Conn
}

func (game *Game) addClient(conn *websocket.Conn) {
	game.mu.Lock()
	defer game.mu.Unlock()
	game.clients = append(game.clients, conn)
}

func (game *Game) removeClient(conn *websocket.Conn) {
	game.mu.Lock()
	defer game.mu.Unlock()
	for i := 0; i < len(game.clients); i++ {
		if game.clients[i] == conn {
			game._removeAt(i)
			break
		}
	}
}

func (game *Game) _removeAt(i int) {
	game.clients[len(game.clients)-1], game.clients[i] = game.clients[i], game.clients[len(game.clients)-1]
	game.clients = game.clients[:len(game.clients)-1]
}

func (game *Game) broadcast(sender *websocket.Conn, mt int, message []byte) {
	game.mu.Lock()
	defer game.mu.Unlock()
	for i := 0; i < len(game.clients); i++ {
		if game.clients[i] != sender {
			err := game.clients[i].WriteMessage(mt, message)
			if err != nil {
				log.Println("error on write:", err)
				game.clients[i].Close() // let the reader thread choke on this and clean up
			}
		}
	}
}

var upgrader = websocket.Upgrader{} // use default options

func makeEchoHandler(game *Game) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		defer c.Close()
		game.addClient(c)
		defer game.removeClient(c)
		for {
			mt, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				break
			}
			log.Printf("recv: %s", message)
			game.broadcast(c, mt, message)
		}
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	game := Game{}
	http.HandleFunc("/echo", makeEchoHandler(&game))
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
