import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import GameArea from '../components/GameArea';
import Progress from '../components/Progress';

const INIT_GAME="init_game";
const START_GAME="start_game";
const COUNTDOWN="countdown";
const Game = () => {
const location = useLocation();
const { type, username } = location.state || {}; // Destructuring state

const socket=useSocket();
const [initialized, setInitialized] = useState(false);
const [text,setText]=useState([]);
const [countdown,setCountdown]=useState(10);
const [players,setPlayers]=useState([]);
useEffect(()=>{
    if(!socket || initialized)
    {
        return;
    }
    socket.send(JSON.stringify({
        type:type,
        payload:{
            id:username
        }
    }));
    setInitialized(true);
    console.log("socket created");
},[socket, initialized, type]);

useEffect(()=>{
    if(!socket)
        {
            return;
        }
        socket.onmessage=(event:any)=>{
             const message=JSON.parse(event.data);
             console.log(message);
             switch(message.type){
                case INIT_GAME:
                    console.log("Game Initialized");
                    setText(message.payload.text);
                    break;
                case COUNTDOWN:
                    setCountdown(message.payload.count);
                    break;
                case START_GAME:
                    const msg=message.payload;
                    console.log("game started")
                    console.log(msg.message);
                    setPlayers(message.payload.players);
             }
        }
},[socket])

  if(!socket)
  {
        return <div>connecting</div>
  }
  return (
    <div>

        <Progress/>
        <h1>Game Page</h1>
        <p>Type: {type}</p>
        <p>Username: {username}</p>
        <p>players: </p>
        <ul>
        {players.map((player:any, index) => (
          <li key={index}>{player.playerId}, {player.progress}, {player.speed}</li> // Assuming `player.name` exists
        ))}
      </ul>

        <div>
            game will start in {countdown} seconds.
        </div>
        
        <GameArea socket={socket} text={text}/>
    </div>
  )
}

export default Game
