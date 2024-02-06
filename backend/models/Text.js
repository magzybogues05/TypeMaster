const mongoose=require('mongoose');

const textSchema= new mongoose.Schema({
    sentence:{
        type:String,
        required:[true,"Sentence can't be empty"],
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        default:"easy",
    }
},
{
    timestamps:true,
});

textSchema.statics.getDocuments= async function({difficult,count}){

    try{
        const randomDocuments= await this.aggregate([
            {$match : {difficult: (difficult || "easy")}},
            {$sample: {size:(count||10)}},
        ]);
        const text= randomDocuments.map((document)=>document.sentence).join(' ');
        return text.split(" ").map(word => word.trim()).filter(word => word!="");
    }
    catch(err)
    {
        console.error('error retrieving random document',err);
        return [];
    }
};

mongoose.exports=mongoose.model('Text',textSchema);