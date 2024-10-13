"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages");
const utils_1 = require("./utils");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingGames = [];
        this.users = [];
        this.guestNumber = 1;
    }
    addUser(socket) {
        this.users.push(socket);
        const currentPlayer = {
            id: "",
            socket: socket,
            progress: 0,
            errors: [],
            speed: 0,
            finished: false,
        };
        this.guestNumber++;
        this.addHandler(socket, currentPlayer);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user != socket);
    }
    addHandler(socket, currentPlayer) {
        socket.on("message", (data) => {
            var _a, _b, _c;
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_PUBLIC) {
                currentPlayer.id = message.payload.id;
                const players = [];
                players.push(currentPlayer);
                const newRoom = {
                    id: "xyz",
                    players: players,
                    text: (0, utils_1.randomText)()
                };
                (_a = this.pendingGames) === null || _a === void 0 ? void 0 : _a.push(newRoom);
                socket.send(JSON.stringify({
                    type: messages_1.INIT_GAME,
                    payload: {
                        message: "game created, waiting for others to join.",
                        text: newRoom.text
                    }
                }));
            }
            if (message.type == messages_1.JOIN_PUBLIC) {
                currentPlayer.id = message.payload.id;
                if ((_b = this.pendingGames) === null || _b === void 0 ? void 0 : _b.length) {
                    this.pendingGames[0].players.push(currentPlayer);
                    socket.send(JSON.stringify({
                        type: messages_1.INIT_GAME,
                        payload: {
                            message: "waiting for others to join.",
                            text: this.pendingGames[0].text
                        }
                    }));
                    if (this.pendingGames[0].players.length == 3) {
                        const fullRoom = this.pendingGames.shift();
                        //start the game
                        const game = new Game_1.Game(fullRoom);
                        console.log("game created");
                        this.games.push(game);
                    }
                }
                else {
                    const players = [];
                    players.push(currentPlayer);
                    const newRoom = {
                        id: "xyz",
                        players: players,
                        text: (0, utils_1.randomText)()
                    };
                    (_c = this.pendingGames) === null || _c === void 0 ? void 0 : _c.push(newRoom);
                    socket.send(JSON.stringify({
                        type: messages_1.INIT_GAME,
                        payload: {
                            message: "waiting for others to join.",
                            text: newRoom.text
                        }
                    }));
                }
            }
            if (message.type === messages_1.TYPE) {
                const game = this.games.find(game => game.players.some(player => player.socket === socket));
                if (game) {
                    game.updateStats(socket, message.payload.stats);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
