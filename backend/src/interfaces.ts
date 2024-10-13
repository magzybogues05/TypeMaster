import { WebSocket } from "ws";

export interface Player {
    id: string;
    socket: WebSocket;
    progress: number; // Characters typed correctly
    errors: string[];   // Number of typing errors
    speed: number;    // Typing speed in WPM
    finished: boolean; // Whether the player has finished typing
}

export interface Room {
    id: string;
    players: Player[]; //List of all players
    text: string[]; // content 
    // started: boolean; //game state
    // completed: boolean;
}
export interface playerDetails{
    playerId:string,
    progress:number,
    speed:number
}