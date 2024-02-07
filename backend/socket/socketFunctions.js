const Text= require("../models/Text");
const Game= require('../models/Game');

const startGame = async function(io,gameId,duration){

    const game= await Game.findById(gameId);
    game.startTime= new Date().getTime();
    await game.save();

    let countDown= duration;
    const timerId = setInterval((function gameIntervalfunction(){

        if(countDown>=0)
        {
            (async ()=>{

                let message ="All the Best";
                if(countDown === 0 ){
                    message="Game Over!";
                }

                io.to(gameId).emit('timer',{
                    message:message,
                    countDown
                });
                countDown-=1;

                //if everybody finished typing before the timer ends
                if(game.playersFinished === game.players.length)
                {
                    io.to(gameId).emit('updateGame',{
                        message:"Game Over!",
                        game
                    });
                    clearInterval(timerId);
                }
            })();
        }
        else{
            (async()=>{
                try{
                    let endTime= new Date().getTime();
                    if(!game)
                    {
                        clearInterval(timerId);
                        return;
                    }

                    let {startTime}=game;
                    game.isOver=true;
                    game.players.foreach((player,index)=>{
                        game.players[index].WPM=calculateWPM(endTime,startTime,player);
                    })
                    await game.save();
                    io.to(gameId).emit("updateGame",{
                        message:"Game Over!",
                        game
                    });
                    clearInterval(timerId);

                }
                catch (err){
                      console.log(err);
                }
            })();
        }
        return gameIntervalfunction;
    })(),1000);
}


//calculate WPM 
const calculateWPM=(endTime,startTime,player)=>{
    const timeTaken=((endTime-startTime)/1000)/60;
    const wordTyped=player.currentWordIndex;
    const WPM=Math.ceil(wordTyped/timeTaken);
    return WPM;
}

module.exports.createOrJoinGame=async function(io,socketId,socket,name="Anonymous",difficulty="easy",mode="solo",duration=60){

    try{
        const player={socketID:socketId,name};
        const game= await Game.findOrCreateGame(difficulty,player,mode);
        const gameId=game._id.toString();
        socket.join(gameId);
        io.to(gameId).emit('updateGame',{
            message:"waiting for players to join",
            game
        });
        if(game.remainingPlayers == 0){
            game.canJoin=false;
            await game.save();
            let countDown=5;
            const timerId=setInterval(async()=>{
                if(countDown >=0)
                {
                    io.to(gameId).emit('timer',{
                        countDown,
                        message:"Game Starting"
                    });
                    countDown-=1;
                }
                else{
                    clearInterval(timerId);
                    io.to(gameId).emit('updateGame',{
                        message:"Game Started",
                        game
                    });
                    if(mode==="solo") startGame(io,gameId,duration);
                    else startGame(io,gameId,60);
                }
            },1000);
        }
    }
    catch(err){
        console.log(err);
    }

}


module.exports.userInput= async function(io,socketId,socket,userInput,gameId)
{
    const game=await Game.findById(gameId);
    if(game && !game.canJoin && !game.isOver)
    {
        const player=game.players.find((currplayer)=>currplayer.socketID === socketId);
        if(game.text[player.currentWordIndex]===userInput.trim())
        {
            player.currentWordIndex+=1;
            if(player.currentWordIndex !== game.text.length)
            {
                await game.save();
                io.to(gameId).emit("updateGame",{
                    message:"continue",
                    game
                });
            }
            else{
                let endTime=new Date().getTime();
                let {startTime}=game;
                player.WPM=calculateWPM(endTime,startTime,player);
                game.playersFinished+=1;
                if(game.playersFinished === game.players.length)
                {
                    game.isOver=true;
                }
                await game.save();
                io.to(gameId).emit("updateGame",{
                    message:"Game Over!",
                    game
                });
            }
        }
    }
}