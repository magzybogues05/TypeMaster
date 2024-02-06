const mongoose= require('mongoose');
// const playerSchema=
// const Text 

const gameSchema= new mongoose.Schema({
    text: [
        {
            type:string,
        }
    ],
    players: [playerSchema],
    canJoin:{
        type:Boolean,
        default:true,
    },
    isOver:{
        type:Boolean,
        default:false,
    },
    startTime:{
        type:Number,
        default:-1,
    },
    remainingPlayers:{
        type:Number,
        default:2,
    },
    playersFininshed:{
        type:Number,
        default:0
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        default:"easy",
    }
},
{
    timestamps:true,
}
);

gameSchema.statics.findorCreateGame=async function(difficulty,player,solo){

}

module.exports=mongoose.model('Game',findorCreateGame);