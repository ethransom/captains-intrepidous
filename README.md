
# Captains Intrepidous

![build status](https://img.shields.io/github/workflow/status/ethransom/captains-intrepidous/Go)

[comment]: <> (## Try it maybe live at intrepidous.hopto.org!)

## building
### Server
    go build
or setup your ide to build a go directory
### Client
See webassembly instructions:
https://github.com/golang/go/wiki/WebAssembly#getting-started

### TODO

- [ ] Milestone 1 - Basic Game
  - [ ] Write simple client
  - [ ] Barebones server that updates game state
- [ ] Milestone 2 - Basic gameplay
  - [ ] Add gravity
  - [ ] Add collisions
  - [ ] Add graphics
  - [ ] Set up some tests
    - Many ways we could do this. (Classic Unit & Integration? Unit and Godot-style semi-automated "integration" tests?)
  - [ ] Set up basic CI and CD
- [ ] Milestone 3 - Gud game
  - [ ] Implement fuel?
  - [ ] Implement building?
  - [ ] Implement box2d?
  - [ ] profit
