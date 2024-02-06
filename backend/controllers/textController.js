const Text= require('./../models/Text');

const getText=async(req,res)=>{
    try{
        // fetch random document from database

        const text=await Text.getDocuments(req.headers);

        res.status(200).json({
            status: "success",
            resultSize:text.length,
            difficulty:(req.headers.difficulty || "easy"),
            data:{
                text
            }
        });
    }
    catch(err){
        res.status(500).json({
            status:"fail",
            message:err.message,

        });
    }
}

const postText=async function(req,res){
    try{
        // create a new document  based on the Textmodel schema
        //req.body contains 'sentence' and 'difficulty' fields...
        const newText=new Text(req.body);

        //save new document into database
        const savedText= await newText.save();

        //respond the saved document
        req.status(201).json(savedText);
    }
    catch(err){
        console.error('Error saving text: ',err);
        res.status(500).json({
            status:"fail",
            message:err.message,
        });
    }
}

module.exports={getText,postText};
