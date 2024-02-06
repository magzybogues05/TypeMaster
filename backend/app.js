const http=require('http');
const express=require('express');
const cors=require('cors');
const socket_io=require('socket.io');
require('dotenv').config();

//database connection
// require('./database/db')()

//router
// const textRouter = require('')


//creating express application

const app=express();
const server=http.createServer(app);

//middlewares
app.use(cors());
app.use(express.json());

//socket
const io=socket_io(server);
// const socketFunctions= require('./socket/')

// listening to socket events
io.on('connection',function(socket){
    console.log(`socket id: ${socket.id}`);


    socket.on()
})


// starting server
const port=process.env.PORT || 3000;
server.listen(port,()=>{
    console.log(`App running on port ${port}`);
})

//Home route

app.get('/',(req,res)=>{
    res.send('<h1> server is running </h1>');
})

app.use('/api/v1',textRouter);