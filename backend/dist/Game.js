"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const messages_1 = require("./messages");
const utils_1 = require("./utils");
class Game {
    constructor(currentRoom) {
        this.gameText = [];
        this.players = [];
        this.startTime = new Date();
        this.gameText = currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.text;
        this.room = currentRoom;
        // console.log("players are: ",currentRoom?.players);
        if (currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.players) {
            this.players = [...currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.players];
        }
        const playersDetail = [];
        this.players.forEach(player => {
            playersDetail.push({
                playerId: player === null || player === void 0 ? void 0 : player.id,
                progress: player === null || player === void 0 ? void 0 : player.progress,
                speed: player === null || player === void 0 ? void 0 : player.speed
            });
        });
        (0, utils_1.broadcastToRoom)(this.room, messages_1.START_GAME, {
            text: this.gameText,
            countDown: 10,
            players: playersDetail
        });
        (0, utils_1.startGameWithCountdown)(this.room, 10);
    }
    updateStats(socket, stats) {
        const player = this.players.find(p => p.socket === socket);
        if (player) {
            player.speed = stats.speed;
            if (stats.error) {
                player.errors.push(stats.error);
            }
            player.progress = stats.progress;
        }
        //check if this player finished?
        //if yes put the number in front of him(his standing)
        //check if all the player finished (stop the game)
        //update his status 
        //forward it to everyone
        (0, utils_1.broadcastToRoom)(this.room, "update_state", {
            playerId: player === null || player === void 0 ? void 0 : player.id,
            speed: player === null || player === void 0 ? void 0 : player.speed,
            progress: player === null || player === void 0 ? void 0 : player.progress
        });
    }
}
exports.Game = Game;
