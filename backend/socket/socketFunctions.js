const Text= require("../models/Text");
const Game= require('../models/Game');

startGame = async function(io,gameId,duration){

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
            // (async()=>{
            //     try{
            //         let endTime= new Date().getTime();
            //         if(!game)
            //         {
            //             clearInterval(timerId);
            //             return;
            //         }

            //         let {startTime}=game;
            //         game.isOver=true;
            //         game.players.foreach()
            //     }
            // })
        }

    }))

}
