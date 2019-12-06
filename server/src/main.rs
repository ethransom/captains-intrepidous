// A websocket web server
extern crate ws;

use ws::listen;

fn main() {
    println!("Hello, world!");
    listen("127.0.0.1:8080", |out| {
        move |msg| {
            out.send(msg);
        }
    }).unwrap()

}
