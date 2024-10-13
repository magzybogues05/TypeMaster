import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE, START_GAME } from "./messages";
import { Player, playerDetails, Room } from "./interfaces";
import { broadcastToRoom, startGameWithCountdown } from "./utils";

export class Game{
    private startTime:Date;
    private gameText:string[]|undefined=[];
    public players:Player[]=[];
    private room:Room|undefined;
    constructor(currentRoom:Room|undefined)
    {
        this.startTime=new Date();
        this.gameText=currentRoom?.text;
        this.room=currentRoom;
        // console.log("players are: ",currentRoom?.players);
        if(currentRoom?.players)
        {
            this.players=[...currentRoom?.players];
        }
        const playersDetail:playerDetails[]=[];
        this.players.forEach(player => {
            playersDetail.push({
                playerId:player?.id,
                progress:player?.progress,
                speed:player?.speed
            })
        });

        broadcastToRoom(this.room,START_GAME,
            {
                text:this.gameText,
                countDown:10,
                players:playersDetail
            });
        startGameWithCountdown(this.room,10);
    }
    updateStats(socket:WebSocket,stats:{
        progress: number;
        speed: number;
        error:string|null
    })
    {
        const player=this.players.find(p => p.socket === socket);
        if(player)
        {
            player.speed=stats.speed;
            if(stats.error)
            {
                player.errors.push(stats.error);
            }
            player.progress=stats.progress;
        }
        
        //check if this player finished?
        //if yes put the number in front of him(his standing)
        //check if all the player finished (stop the game)
        
        //update his status 
        //forward it to everyone

        broadcastToRoom(this.room,"update_state",{
            playerId:player?.id,
            speed:player?.speed,
            progress:player?.progress
        });
    }
}