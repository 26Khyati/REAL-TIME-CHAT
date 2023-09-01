const express = require('express');
const http=require('http');
const app= express();
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const server = http.createServer(app);
const io= socketio(server);
const {userJoin , getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');
const botname = 'ChatChord Bot'; 
//set static folder
var path =require('path');
app.use(express.static(path.join(__dirname,'public')));

io.on('connection',(socket)=>{
    console.log('user connected');
    socket.on('joinRoom',({username,room})=>{
    const user =userJoin(socket.id,username,room);
    socket.join(user.room);
    
    //a new user joins, welcome
    socket.emit('message',formatMessage(botname,'Welcome to chatchord'));
    
    // a new user joins, other should know
    socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has joined the chat`));
     
    //send user and rooom info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    });

});
        //listen for chatMessage
        socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg)); });
    
    
        socket.on('disconnect',()=>{
        console.log('user disconnected');
        //leave chat
        const user= userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat`))

        }
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });


    
    });
const PORT = 3000 || process.env.PORT;
server.listen(PORT,()=>
    {console.log(`Server is running on port ${PORT}`);}
);
