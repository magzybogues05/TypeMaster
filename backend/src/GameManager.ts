import { Game } from "./Game";
import { Player, Room } from "./interfaces";
import { INIT_GAME, INIT_PUBLIC,JOIN_PUBLIC, TYPE } from "./messages";
import { WebSocket } from "ws";
import { randomText } from "./utils";

export class GameManager{
    private games:Game[];
    private pendingGames: Room[] | null;
    private users:WebSocket[];
    private guestNumber:number;
    constructor(){
        this.games=[];
        this.pendingGames=[];
        this.users=[];
        this.guestNumber=1;
    }
    addUser(socket:WebSocket){
        this.users.push(socket);
        const currentPlayer:Player={
            id: "",
            socket:socket,
            progress: 0,
            errors: [],
            speed: 0,
            finished: false,
        }
        this.guestNumber++;
        this.addHandler(socket,currentPlayer);
    }
    removeUser(socket:WebSocket){
        this.users=this.users.filter(user=>user!=socket);
    }
    private addHandler(socket:WebSocket,currentPlayer:Player){
        socket.on("message",(data)=>{
            const message=JSON.parse(data.toString());
            if(message.type===INIT_PUBLIC){
                currentPlayer.id=message.payload.id;
                const players:Player[]=[];
                players.push(currentPlayer);
                const newRoom:Room={
                    id: "xyz",
                    players: players,
                    text: randomText()
                };
                this.pendingGames?.push(newRoom);
                socket.send(JSON.stringify({
                    type:INIT_GAME,
                    payload:{
                        message:"game created, waiting for others to join.",
                        text:newRoom.text
                    }
                }));
            }
            if(message.type==JOIN_PUBLIC){
                currentPlayer.id=message.payload.id;
                if(this.pendingGames?.length)
                {
                    this.pendingGames[0].players.push(currentPlayer);
                    socket.send(JSON.stringify({
                        type:INIT_GAME,
                        payload:{
                            message:"waiting for others to join.",
                            text:this.pendingGames[0].text
                        }
                    }));
                    if(this.pendingGames[0].players.length==3)
                    {
                        const fullRoom:Room|undefined = this.pendingGames.shift();
                        //start the game
                        const game:Game=new Game(fullRoom);
                        console.log("game created");
                        this.games.push(game);
                    }
                }
                else{

                    const players:Player[]=[];
                    players.push(currentPlayer);
                    const newRoom:Room={
                        id: "xyz",
                        players: players,
                        text: randomText()
                    };
                    this.pendingGames?.push(newRoom);
                    socket.send(JSON.stringify({
                        type:INIT_GAME,
                        payload:{
                            message:"waiting for others to join.",
                            text:newRoom.text
                        }
                    }));
                }
                
            }
            if(message.type===TYPE){
                const game=this.games.find(game => 
                    game.players.some(player => player.socket === socket)
                );
                if(game)
                {
                    game.updateStats(socket,message.payload.stats);
                }
            }
        })
    }
}

